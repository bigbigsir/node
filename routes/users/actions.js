const User = require('../../mongoose/user')
const Token = require('../../mongoose/token')
const { privateDecrypt } = require('../../util/util')
const { createWebToken } = require('../common/actions')

// 注册
function signUp (req) {
  const { password, ...args } = req.body
  args.password = privateDecrypt(password)
  const user = new User(args)
  return user.save().then(() => signIn(req))
}

// 登录，验证密码=>标记该账号的其他token无效=>保存新token=>返回用户信息
function signIn (req) {
  const projection = {
    password: 0
  }
  let { username, password } = req.body
  password = privateDecrypt(password)
  return User.findOne({
    username,
    password
  }, projection).lean().then(user => {
    if (user) return saveToken(user)
    return Promise.resolve({ code: 'N_000002' })
  })

  function saveToken (user) {
    const appId = req.get('appId')
    const token = req.get('token')
    const username = user.username
    const filter = {
      appId,
      username,
      invalid: false
    }
    const instance = new Token({
      appId,
      token,
      username
    })
    return Token.findOneAndUpdate(filter, { invalid: true })
      .then(() => instance.save())
      .then(() => ({
        code: '0',
        data: user
      }))
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
      if (token.invalid) {
        return Promise.resolve({ code: 'N_000004' })
      } else {
        Token.findByIdAndUpdate(token._id, { exp: new Date() })
        return Promise.resolve({ code: '0' })
      }
    } else {
      return Promise.resolve({ code: 'N_000003' })
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
