const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const crypto = require('crypto')
const moment = require('moment')
const childProcess = require('child_process')
// const jwt = require('../../util/token')
const Project = require('../../mongoose/project')
const errorCode = require('../../config/error_code')

// 获取项目信息
function updateForAdmin (projectId, socket) {
  return getProjectConfig({ _id: projectId }).then(({ code, data }) => {
    if (code === '0') {
      compileProject(data, socket).finally(() => {
        socket && socket.disconnect(true)
      })
    } else {
      socket && socket.emit('error', errorCode.N_000017.message)
    }
  })
}

// GitHub上master分支触发push事件调用该接口
function updateForGitHub (req) {
  const key = req.params.key
  const body = req.body
  const event = req.get('X-GitHub-Event')
  if (body.ref === 'refs/heads/master' && event === 'push') {
    return getProjectConfig({ key }).then(({ code, data }) => {
      if (code === '0') {
        if (verifySecret(req, data.secret)) {
          compileProject(data)
        } else {
          return { code: 'N_000007' }
        }
      }
      return { code }
    })
  } else {
    return { code: 'N_000007' }
  }
}

// 编译项目
function compileProject (config, socket) {
  const options = {
    cwd: config.projectDir
  }
  const shellFile = path.resolve(config.shellPath)
  const pullCode = path.resolve('./shell/pull_code.sh')
  return runCmd('sh', [pullCode], options, socket).then(() => {
    const modified = getModified(options)
    const needNpmInstall = modified.includes('package.json')
    const needReloadNginx = modified.includes('nginx.conf')
    const args = [shellFile, needNpmInstall, needReloadNginx]
    return runCmd('sh', args, options, socket)
  }).then(() => {
    if (config.type === 'Node') restartSocketPort()
  })
}

// 重启Socket端口
function restartSocketPort () {
  const pm2Restart = path.resolve('./shell/pm2_restart.sh')
  crateVersionHtml()
  runCmd('sh', [pm2Restart])
}

// 获取项目配置，并校验GitHub的sign
function getProjectConfig (query) {
  return Project.findOne(query).then(data => {
    if (data) {
      return {
        code: '0',
        data
      }
    }
    return { code: 'N_000017' }
  })
}

// 获取版本信息
function getVersion (req) {
  const { id } = req.body
  return getProjectConfig({ _id: id }).then(({ code, data }) => {
    if (code === '0') {
      return runCommand(data)
    } else {
      return { code }
    }
  })

  function runCommand (config) {
    const options = {
      cwd: config.projectDir
    }
    return new Promise((resolve, reject) => {
      childProcess.exec('git fetch origin', options, (error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    }).then(() => {
      const commit = childProcess.execSync('git show -s --format=%H', options).toString().trim()
      const committer = childProcess.execSync('git show -s --format=%cn', options).toString().trim()
      const originCommit = childProcess.execSync('git show origin/master -s --format=%H', options).toString().trim()
      const originCommitter = childProcess.execSync('git show origin/master -s --format=%cn', options).toString().trim()
      return {
        code: '0',
        data: {
          current: {
            commit,
            committer
          },
          origin: {
            commit: originCommit,
            committer: originCommitter
          }
        }
      }
    })
  }
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
    buildDate: buildDate
  }
  ejs.renderFile(path.resolve('./views/version.ejs'), { version }, (err, str) => {
    const html = err ? `<pre>${err}</pre>` : str
    fs.writeFile(path.resolve('./public/version.html'), html, (err) => {
      if (err) console.log(err)
    })
  })
}

// 开启子进程执行终端命令
function runCmd (cmd, args, options, socket) {
  let log = ''
  const spawn = childProcess.spawn
  const child = spawn(cmd, args, options || {})

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
function getModified (options) {
  const modified = childProcess.execSync('git diff --name-only HEAD~ HEAD', options)
  return modified.toString().trim().split('\n')
}

module.exports = {
  getVersion,
  updateForGitHub,
  updateForAdmin
}
