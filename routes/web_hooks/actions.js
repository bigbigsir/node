const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const crypto = require('crypto')
const moment = require('moment')
const childProcess = require('child_process')

// 开启子进程执行终端命令
function runCmd (cmd, args, options = {}, cb = null) {
  let log = ''
  const spawn = childProcess.spawn
  const child = spawn(cmd, args, options)

  child.stdout.on('data', (data) => {
    log += data.toString()
  })

  child.stderr.on('data', (data) => {
    log += data.toString()
  })

  child.on('error', function (data) {
    log += `child_process error  ${data.toString()}`
    cb && cb(log)
    console.log(log)
  })

  child.on('close', (code) => {
    log += `child_process close 进程退出，退出码 ${code}`
    cb && cb(log)
    console.log(log)
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

function projectNode (req) {
  const body = req.body
  const sign = req.get('X-Hub-Signature')
  const event = req.get('X-GitHub-Event')
  const ref = body.ref
  const modified = body.head_commit.modified
  const reloadNginx = modified.includes('nginx.conf')
  const npmInstall = modified.includes('package.json')
  const pullCode = path.resolve('./shell/pull_code.sh')
  const pm2Reload = path.resolve('./shell/pm2_reload.sh')
  const verified = ref === 'refs/heads/master' && event === 'push' && verifySecret(body, sign)

  if (verified) {
    return new Promise((resolve) => {
      const args = [pullCode, reloadNginx, npmInstall]
      runCmd('sh', args, {}, (message) => {
        resolve({
          code: '0',
          data: message
        })
        crateVersionHtml(req.body)
        runCmd('sh', [pm2Reload])
      })
    })
  } else {
    return Promise.resolve({ code: 'N_000007' })
  }

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
  const body = req.body
  const sign = req.get('X-Hub-Signature')
  const event = req.get('X-GitHub-Event')
  const ref = body.ref
  const options = {
    cwd: '../react_web'
  }
  const modified = getModified(req, options)
  const npmInstall = modified.includes('package.json')
  const pullCode = path.resolve('./shell/project_react_web.sh')
  const verified = ref === 'refs/heads/master' && event === 'push' && verifySecret(body, sign)

  if (verified) {
    return new Promise((resolve) => {
      const args = [pullCode, npmInstall]
      runCmd('sh', args, options, (message) => {
        resolve({
          code: '0',
          data: message
        })
      })
    })
  } else {
    return Promise.resolve({ code: 'N_000007' })
  }
}

module.exports = {
  projectNode,
  projectReactWeb
}
