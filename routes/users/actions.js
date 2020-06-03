const User = require('../../mongoose/user')
const Token = require('../../mongoose/token')
const { privateDecrypt } = require('../../util/util')

// 登录
function signIn (req) {
  const projection = {
    password: 0
  }
  let { username, password } = req.body
  password = privateDecrypt(password)
  return User.findOne({
    username,
    password
  }, projection).then(user => {
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
        code: 0,
        data: user
      }))
  }
}

// 注册
function signUp (req) {
  const { password, ...args } = req.body
  args.password = privateDecrypt(password)
  const user = new User(args)
  return user.save().then(() => signIn(req))
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
        token.set({ exp: new Date() })
        return token.save().then(() => ({ code: '0' }))
      }
    } else {
      return Promise.resolve({ code: 'N_000003' })
    }
  })
}

module.exports = {
  signIn,
  signUp,
  verifyLoginAuth
}
