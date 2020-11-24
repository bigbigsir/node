const User = require('../../mongoose/user')
const Menu = require('../../mongoose/menu')
const Token = require('../../mongoose/token')
const { privateDecrypt } = require('../../util/util')
const { createWebToken, verifyCaptcha } = require('../common/actions')
const { verifyEmailCode } = require('../email/actions')

// 查找用户名或邮箱是否已注册
function findUserIsExist (username, email) {
  return User.findOne({ $or: [{ username }, { email }] }).then(user => {
    if (!user) {
      return { code: '0' }
    } else if (user.username === username) {
      return { code: 'N_000009' }
    } else {
      return { code: 'N_000012' }
    }
  })
}

// 注册，查找用户名是否注册=>保存新用户=>登录
function signUp (req) {
  const { email, username } = req.body
  return verifyEmailCode(req).then(({ code }) => {
    if (code === '0') {
      return findUserIsExist(username, email).then(() => saveUser(req))
    } else {
      return { code }
    }
  })

  function saveUser (req) {
    const body = req.body
    const { username, password } = body
    body.password = privateDecrypt(password)
    body.createMethod = 'register'
    return new User(body).save().then(() => {
      req.body = {
        username,
        password
      }
      return signIn(req)
    }).catch((error) => ({
      error,
      code: 'N_000010'
    }))
  }
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
    const { username, password } = req.body
    const pwd = privateDecrypt(password)
    const query = {
      $or: [
        {
          username,
          password: pwd
        }, {
          email: username,
          password: pwd
        }
      ]
    }
    return User.findOne(query).then(data => {
      if (data) {
        return updateUser(data._id)
      } else {
        return { code: 'N_000002' }
      }
    })
  }

  function updateUser (id) {
    const update = { lastLoginDate: Date.now() }
    const projection = {
      _id: 0,
      id: 0,
      password: 0
    }
    return User.findByIdAndUpdate(id, update, {
      projection,
      lean: true
    })
      .populate('role', 'name menus')
      .then(findUserMenus)
      .then(trashTokens)
      .then(saveToken)
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

  function trashTokens (user) {
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

// 查找改用户角色下的菜单权限
function findUserMenus (user) {
  const options = {
    sort: {
      sort: 1
    }
  }
  const select = '-created -updated'
  const menusId = user.role ? user.role.menus : []
  return Menu.find({ parent: null }, select, options).then(data => {
    user.menus = filter(data)
    return user
  })

  function filter (data) {
    return data.filter(item => {
      const isExist = menusId.some(value => String(value) === String(item.id))
      if (isExist) {
        item.children = filter(item.children)
      }
      return isExist
    })
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
    valid: true
  }
  return Token.deleteMany(filter).then(() => createWebToken(req))
}

// 获取用户信息
function getUserInfo (req) {
  const projection = {
    _id: 0,
    password: 0
  }
  const username = req.body.loginName
  return User.findOne({ username }, projection, { lean: true }).populate('role', 'name menus').then(user => {
    if (user) {
      return findUserMenus(user).then(data => ({
        data,
        code: '0'
      }))
    }
    return { code: 'N_000016' }
  })
}

// 验证登录权限
function verifyLoginAuth (req) {
  const token = req.get('token')
  const appId = req.get('appId')
  const username = req.body.loginName
  const filter = {
    appId,
    token,
    username
  }
  return Token.findOne(filter).then(token => {
    if (token) {
      if (token.valid) {
        token.set({ exp: Date.now() })
        return token.save().then(() => ({ code: '0' }))
      } else {
        return { code: 'N_000004' }
      }
    } else {
      return { code: 'N_000003' }
    }
  })
}

// 获取用户列表
function getUserList (req) {
  let { page, pageSize } = req.body
  page = parseInt(page) || 1
  pageSize = parseInt(pageSize) || 10
  return Promise.all([
    User.count(),
    User.find().skip((page - 1) * pageSize).limit(pageSize).select('-password').populate('role', 'id name')
  ]).then(([count, data]) => {
    return {
      code: '0',
      data: {
        page: page,
        pageSize: pageSize,
        total: count,
        maxPage: Math.ceil(count / pageSize),
        rows: data
      }
    }
  })
}

// 添加用户
function addUser (req) {
  const body = req.body
  const { email, username, loginName } = body
  body.creator = loginName
  body.password = '123456'
  body.createMethod = 'admin'

  return findUserIsExist(username, email).then(({ code }) => {
    if (code === '0') {
      return saveUser(body)
    }
    return { code }
  })

  function saveUser (body) {
    return new User(body).save().then(data => {
      return {
        data,
        code: '0'
      }
    }).catch((error) => ({
      error,
      code: 'N_000010'
    }))
  }
}

// 编辑用户
function updateUser (req) {
  const { id, role } = req.body
  const ops = {
    new: true,
    runValidators: true
  }
  req.body.role = role
  return User.findByIdAndUpdate(id, req.body, ops).then(data => {
    return {
      data,
      code: '0'
    }
  })
}

// 删除用户
function removeUser (req) {
  const { id } = req.body
  return User.findByIdAndRemove(id).then(data => ({
    code: '0'
  })).catch((error) => ({
    error,
    code: 'N_000010'
  }))
}

module.exports = {
  signIn,
  signUp,
  signOut,
  addUser,
  removeUser,
  updateUser,
  getUserInfo,
  getUserList,
  verifyLoginAuth
}
