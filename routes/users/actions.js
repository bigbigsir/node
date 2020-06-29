const User = require('../../mongoose/user')
const Token = require('../../mongoose/token')
const { privateDecrypt } = require('../../util/util')
const { createWebToken, verifyCaptcha } = require('../common/actions')

// 注册
function signUp (req) {
  const { password, ...args } = req.body
  args.password = privateDecrypt(password)
  const user = new User(args)
  return user.save().then(() => signIn(req))
}

// 登录，验证密码=>标记该账号的其他token无效=>保存新token=>返回用户信息
function signIn (req) {
  const { captchaId } = req.body

  if (captchaId) {
    return verifyCaptcha(req).then(({ code }) => {
      return code === '0' ? findUser(req) : { code }
    })
  } else {
    return findUser(req)
  }

  function findUser (req) {
    let { username, password } = req.body
    password = privateDecrypt(password)
    return User.findOne({
      username,
      password
    }).then(updateUser)
  }

  function updateUser (user) {
    const projection = {
      _id: 0,
      password: 0
    }
    const update = { lastLoginDate: Date.now() }
    if (user) {
      return User.findByIdAndUpdate(user._id, update, { projection })
        .then(updateTokens).then(saveToken)
    } else {
      return Promise.resolve({ code: 'N_000002' })
    }
  }

  function saveToken (user) {
    const appId = req.get('appId')
    const token = req.get('token')
    const username = user.username
    const instance = new Token({
      appId,
      token,
      username
    })
    return instance.save().then(() => ({
      code: '0',
      data: user
    }))
  }

  function updateTokens (user) {
    const appId = req.get('appId')
    const username = user.username
    const filter = {
      appId,
      username,
      valid: true
    }
    return Token.updateMany(filter, { valid: false }).then(() => user)
  }
}

// 退出登录
function signOut (req) {
  const token = req.get('token')
  const appId = req.get('appId')
  const username = req.body.username
  const filter = {
    appId,
    token,
    username,
    invalid: false
  }
  return Token.findOneAndRemove(filter).then(() => createWebToken(req))
}

// 获取用户信息
function getUserInfo (req) {
  const projection = {
    _id: 0,
    password: 0
  }
  const username = req.body.username
  return User.findOne({ username }, projection).lean().then(user => {
    return {
      code: '0',
      data: user
    }
  })
}

// 验证登录权限
function verifyLoginAuth (req) {
  const token = req.get('token')
  const appId = req.get('appId')
  const username = req.body.username
  const filter = {
    appId,
    token,
    username
  }
  return Token.findOne(filter).then(token => {
    if (token) {
      if (token.valid) {
        Token.findByIdAndUpdate(token._id, { exp: new Date() })
        return { code: '0' }
      } else {
        return { code: 'N_000004' }
      }
    } else {
      return { code: 'N_000003' }
    }
  })
}

module.exports = {
  signIn,
  signUp,
  signOut,
  getUserInfo,
  verifyLoginAuth
}
