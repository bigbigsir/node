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
      return findUserIsExist(username, email).then(({ code }) => {
        if (code === '0') return saveUser(req)
        return { code }
      })
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
    })
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
        return data.enable ? updateUser(data._id) : { code: 'N_000019' }
      } else {
        return { code: 'N_000002' }
      }
    })
  }

  function updateUser (id) {
    const update = { lastLoginDate: Date.now() }
    const projection = {
      id: 0,
      _id: 0,
      password: 0
    }
    const options = {
      new: true,
      lean: true,
      projection
    }
    const populateOptions = {
      path: 'role',
      options: {
        stopAuthPopulate: true
      }
    }
    return User.findByIdAndUpdate(id, update, options).populate(populateOptions)
      .then(trashTokens)
      .then(saveToken)
      .then(findUserMenus)
      .then(data => ({
        data,
        code: '0'
      }))
  }

  // 保存token
  function saveToken (user) {
    const appId = req.get('appId')
    const token = req.get('token')
    const username = user.username
    const instance = new Token({
      appId,
      token,
      username
    })
    return instance.save().then(() => user)
  }

  // 标记同应用同用户名的token为无效
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

// 查找改用户角色下的菜单和权限
function findUserMenus (user) {
  const auths = user.role ? user.role.auths : []
  const menus = user.role ? user.role.menus : []
  const select = {
    created: 0,
    updated: 0
  }
  const options = {
    sort: {
      sort: 1
    }
  }

  delete user.role

  return Menu.find({ parent: null }, select, options).then(data => {
    user.menus = filterMenus(data)
    return user
  })

  function filterMenus (tree = []) {
    return tree.filter(item => {
      const menuIsExist = menus.some(id => String(id) === String(item._id))
      if (menuIsExist) {
        item.auths = filterAuths(item.auths, auths)
        item.children = filterMenus(item.children)
      }
      return menuIsExist
    })
  }

  function filterAuths (auths = [], own = []) {
    return auths.filter(item => own.some(id => String(id) === String(item._id)))
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
  const username = req.body.loginName
  const projection = {
    id: 0,
    _id: 0,
    password: 0
  }
  const populateOptions = {
    path: 'role',
    options: {
      stopAuthPopulate: true
    }
  }

  return User.findOne({ username }, projection, { lean: true }).populate(populateOptions).then(user => {
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
  let { page, pageSize, username, ...filter } = req.body
  const select = {
    password: 0
  }
  const options = {
    sort: {
      created: 1
    }
  }
  const populateOptions = {
    path: 'role',
    select: 'name',
    options: {
      stopAuthPopulate: true
    }
  }

  page = parseInt(page) || 1
  pageSize = parseInt(pageSize) || 10

  username && (filter.username = { $regex: username })
  delete filter.loginName

  return Promise.all([
    User.count(filter),
    User.find(filter, select, options).skip((page - 1) * pageSize).limit(pageSize).populate(populateOptions)
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
  body.createMethod = 'admin'

  return findUserIsExist(username, email).then(({ code }) => {
    if (code === '0') {
      return saveUser(body)
    }
    return { code }
  })

  function saveUser (body) {
    const user = new User(body)
    return user.save().then(() => {
      return {
        code: '0'
      }
    })
  }
}

// 编辑用户
function updateUser (req) {
  const { id, ...rest } = req.body
  const ops = {
    runValidators: true
  }
  return User.findByIdAndUpdate(id, rest, ops).then(() => {
    return { code: '0' }
  })
}

// 重置用户密码
function restPassword (req) {
  const { id, password } = req.body
  const ops = {
    runValidators: true
  }
  return User.findByIdAndUpdate(id, { password }, ops).then(trashTokens).then(() => ({
    code: '0'
  }))

  // 标记该用户名的token为无效
  function trashTokens (user) {
    const username = user.username
    const filter = {
      username,
      valid: true
    }
    return Token.updateMany(filter, { valid: false })
  }
}

// 删除用户
function removeUser (req) {
  const { id } = req.body
  return User.findByIdAndRemove(id).then(() => ({
    code: '0'
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
  restPassword,
  verifyLoginAuth
}
