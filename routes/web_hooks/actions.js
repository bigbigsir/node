const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const crypto = require('crypto')
const moment = require('moment')
const childProcess = require('child_process')
const jwt = require('../../util/token')
const { io } = require(path.resolve('./app.js'))
const nsp = io.of('/socket/webHooks')

nsp.use((socket, next) => {
  const payload = jwt.verifyToken(socket.request.headers.token) || {}
  if (payload.ip === socket.conn.remoteAddress) {
    next()
  } else {
    next(new Error('Authentication error'))
  }
})

function use (req, res, next) {
  const body = req.body
  const sign = req.get('X-Hub-Signature')
  const event = req.get('X-GitHub-Event')
  const ref = body.ref
  const verified = ref === 'refs/heads/master' && event === 'push' && verifySecret(body, sign)
  if (verified) {
    next()
  } else {
    return Promise.resolve({ code: 'N_000007' })
  }
}

function projectNode (req) {
  const body = req.body
  const socketId = req.get('socket-id')
  const pullCode = path.resolve('./shell/pull_code.sh')
  const initProject = path.resolve('./shell/project_node.sh')
  const pm2Restart = path.resolve('./shell/pm2_restart.sh')
  return runCmd('sh', [pullCode], undefined, socketId).then(pullCodeLog => {
    const modified = body.head_commit.modified
    const needReloadNginx = modified.includes('nginx.conf')
    const needNpmInstall = modified.includes('package.json')
    const args = [initProject, needReloadNginx, needNpmInstall]
    return runCmd('sh', args, undefined, socketId).then(initLog => pullCodeLog + initLog)
  }).then(log => {
    crateVersionHtml(req.body)
    runCmd('sh', [pm2Restart], undefined, socketId)
    nsp.sockets[socketId].disconnect(true)
    return {
      code: '0',
      data: log
    }
  }).catch(log => {
    nsp.sockets[socketId].disconnect(true)
    return {
      code: 'N_000008',
      message: log
    }
  })

  function crateVersionHtml (body) {
    const format = 'YYYY-MM-DD hh:mm:ss'
    const version = {
      project: body.repository.name,
      commit: body.head_commit.id,
      committer: body.head_commit.committer.name,
      committerEmail: body.head_commit.committer.email,
      commitDate: moment(new Date(body.head_commit.timestamp)).format(format),
      pullDate: moment().format(format)
    }
    ejs.renderFile(path.resolve('./views/version.ejs'), { version }, (err, str) => {
      const html = err ? `<pre>${err}</pre>` : str
      fs.writeFile(path.resolve('./public/version.html'), html, (err) => {
        if (err) console.log(err)
      })
    })
  }
}

function projectReactWeb (req) {
  const options = {
    cwd: '../react_web'
  }
  const initProject = path.resolve('./shell/project_react_web.sh')
  return webProject(req, options, initProject)
}

function projectVueH5 (req) {
  const options = {
    cwd: '../vue_h5'
  }
  const initProject = path.resolve('./shell/project_vue_h5.sh')
  return webProject(req, options, initProject)
}

function webProject (req, options, initProject) {
  const socketId = req.get('socket-id')
  const pullCode = path.resolve('./shell/pull_code.sh')
  return runCmd('sh', [pullCode], options, socketId).then(pullCodeLog => {
    const modified = getModified(req, options)
    const needNpmInstall = modified.includes('package.json')
    const args = [initProject, needNpmInstall]
    return runCmd('sh', args, options, socketId).then(initLog => pullCodeLog + initLog)
  }).then(log => {
    nsp.sockets[socketId].disconnect(true)
    return {
      code: '0',
      data: log
    }
  }).catch(log => {
    nsp.sockets[socketId].disconnect(true)
    return {
      code: 'N_000008',
      message: log
    }
  })
}

// 开启子进程执行终端命令
function runCmd (cmd, args, options, socketId) {
  let log = ''
  const spawn = childProcess.spawn
  const child = spawn(cmd, args, options || {})
  const socket = nsp.sockets[socketId]

  child.stdout.on('data', (data) => {
    data = data.toString()
    log += data
    socket && socket.emit('process_stdout', data)
  })

  child.stderr.on('data', (data) => {
    data = data.toString()
    log += data
    socket && socket.emit('process_stderr', data)
  })

  return new Promise((resolve, reject) => {
    child.on('error', (err) => {
      err = `child_process error=> ${err.toString()}\n`
      log += err
      reject(log)
      socket && socket.emit('process_error', err)
    })

    child.on('close', (code) => {
      code = `child_process close=> 进程退出，退出码 ${code}\n`
      log += code
      resolve(log)
      socket && socket.emit('process_close', code)
      console.info(log)
    })
  })
}

// 校验GitHub的sign
function verifySecret (payload, sign) {
  payload = JSON.stringify(payload)
  const secret = 'e6f2511e790e05e769416bb4d4603d602943d314'
  const localSign = 'sha1=' + crypto.createHmac('sha1', secret).update(payload).digest('hex')
  return localSign === sign
}

// 获取变更文件列表
function getModified (req, options) {
  const userAgent = req.get('User-Agent')
  if (/^GitHub-Hookshot/.test(userAgent)) {
    return req.body.head_commit.modified
  } else {
    const modified = childProcess.execSync('git diff --name-only HEAD~ HEAD', options)
    return modified.toString().trim().split('\n')
  }
}

module.exports = {
  use,
  projectNode,
  projectVueH5,
  projectReactWeb
}
