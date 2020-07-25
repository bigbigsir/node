const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const crypto = require('crypto')
const moment = require('moment')
const childProcess = require('child_process')
const jwt = require('../../util/token')
const Project = require('../../mongoose/project')
const { io } = require(path.resolve('./app.js'))

const nsp = io.of('/socket/webHooks')

nsp.use((socket, next) => {
  const payload = jwt.verifyToken(socket.request.headers.token)
  console.log(socket.handshake)
  console.log('==================')
  console.log(payload.ip, socket.conn.remoteAddress)
  if (payload) {
    next()
  } else {
    next(new Error('Authentication error'))
  }
})

function webProject (req) {
  return getProjectConfig(req).then(({ code, data }) => {
    if (code === '0') {
      return compileWebProject(req, data)
    } else {
      return data
    }
  })
}

function nodeProject (req) {
  return getProjectConfig(req).then(({ code, data }) => {
    if (code === '0') {
      return compileNodeProject(req, data)
    } else {
      return data
    }
  })
}

// 编译node项目
function compileNodeProject (req, config) {
  const socketId = req.get('socket-id')
  const options = {
    cwd: config.projectDir
  }
  const shellFile = path.resolve(config.shellPath)
  const pullCode = path.resolve('./shell/pull_code.sh')
  const pm2Restart = path.resolve('./shell/pm2_restart.sh')
  return runCmd('sh', [pullCode], options, socketId).then(pullCodeLog => {
    const modified = getModified(req, options)
    const needNpmInstall = modified.includes('package.json')
    const needReloadNginx = modified.includes('nginx.conf')
    const args = [shellFile, needNpmInstall, needReloadNginx]
    return runCmd('sh', args, options, socketId).then(initLog => pullCodeLog + initLog)
  }).then(log => {
    crateVersionHtml()
    runCmd('sh', [pm2Restart], undefined, socketId)
    nsp.sockets[socketId].disconnect(true)
    return {
      code: '0',
      data: log
    }
  }).catch(error => {
    nsp.sockets[socketId].disconnect(true)
    return {
      code: 'N_000008',
      error: error.toString()
    }
  })
}

// 编译前端项目
function compileWebProject (req, config) {
  const socketId = req.get('socket-id')
  const options = {
    cwd: config.projectDir
  }
  const shellFile = path.resolve(config.shellPath)
  const pullCode = path.resolve('./shell/pull_code.sh')
  return runCmd('sh', [pullCode], options, socketId).then(pullCodeLog => {
    const modified = getModified(req, options)
    const needNpmInstall = modified.includes('package.json')
    const needReloadNginx = modified.includes('nginx.conf')
    const args = [shellFile, needNpmInstall, needReloadNginx]
    return runCmd('sh', args, options, socketId).then(initLog => pullCodeLog + initLog)
  }).then(log => {
    nsp.sockets[socketId].disconnect(true)
    return {
      code: '0',
      data: log
    }
  }).catch(error => {
    nsp.sockets[socketId].disconnect(true)
    return {
      code: 'N_000008',
      error: error.toString()
    }
  })
}

// 获取项目配置，并校验GitHub的sign
function getProjectConfig (req) {
  const key = req.params.key
  const body = req.body
  const event = req.get('X-GitHub-Event')
  const userAgent = req.get('User-Agent')
  const isGitHub = /^GitHub-Hookshot/.test(userAgent)
  return Project.findOne({ key }).then(data => {
    if (data) {
      const secret = data.secret
      const verified = (!isGitHub || (body.ref === 'refs/heads/master' && event === 'push')) && verifySecret(req, secret)
      return verified ? {
        data,
        code: '0'
      } : { code: 'N_000007' }
    }
    return { code: 'N_000017' }
  })
}

// 校验GitHub的sign
function verifySecret (req, secret) {
  const sign = req.get('X-Hub-Signature')
  const payload = JSON.stringify(req.body)
  const localSign = 'sha1=' + crypto.createHmac('sha1', secret).update(payload).digest('hex')
  return localSign === sign
}

// 生成版本页面
function crateVersionHtml () {
  const format = 'YYYY-MM-DD hh:mm:ss'

  const projectUrl = childProcess.execSync('git config remote.origin.url').toString().trim()
  const project = projectUrl.split('/').pop()
  const commit = childProcess.execSync('git show -s --format=%H').toString().trim()
  const committer = childProcess.execSync('git show -s --format=%cn').toString().trim()
  const committerEmail = childProcess.execSync('git show -s --format=%ce').toString().trim()
  const commitDateStr = childProcess.execSync('git show -s --format=%cd').toString().trim()
  const commitDate = moment(new Date(commitDateStr)).format(format)
  const buildDate = moment().format(format)

  const version = {
    project: project,
    commit: commit,
    committer: committer,
    committerEmail: committerEmail,
    commitDate: commitDate,
    pullDate: buildDate
  }
  ejs.renderFile(path.resolve('./views/version.ejs'), { version }, (err, str) => {
    const html = err ? `<pre>${err}</pre>` : str
    fs.writeFile(path.resolve('./public/version.html'), html, (err) => {
      if (err) console.log(err)
    })
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
  webProject,
  nodeProject
}
