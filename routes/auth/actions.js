const Auth = require('../../mongoose/auth')
const { formatSortJson } = require('../../util/util')

// 添加权限
function addAuth (req) {
  const body = req.body
  const { menu, key } = body
  const auth = new Auth(body)
  return findKeyIsExist(menu, key).then(({ code }) => {
    if (code === '0') {
      return auth.save().then(() => ({ code: '0' }))
    }
    return { code }
  }).then((code) => {
    return code
  })
}

// 修改权限
function updateAuth (req) {
  const { id, ...rest } = req.body
  const ops = {
    new: true
  }
  return Auth.findByIdAndUpdate(id, rest, ops).then(data => {
    return {
      data,
      code: '0'
    }
  })
}

// 删除权限
function removeAuth (req) {
  const { id } = req.body
  return Auth.findByIdAndRemove(id).then(() => ({
    code: '0'
  }))
}

// 获取权限列表
function getAuthList (req) {
  let { sort, page, pageSize, ...filter } = req.body
  const options = {
    sort: formatSortJson(sort)
  }
  const populateOptions = {
    path: 'menu',
    select: 'name id',
    options: {
      stopAuthPopulate: true,
      stopChildrenPopulate: true
    }
  }
  page = parseInt(page) || 1
  pageSize = parseInt(pageSize) || 10

  delete filter.loginName

  return Promise.all([
    Auth.count(filter),
    Auth.find(filter, undefined, options)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate(populateOptions)
  ]).then(([count, data]) => {
    return {
      code: '0',
      data: {
        page,
        pageSize,
        rows: data,
        total: count,
        maxPage: Math.ceil(count / pageSize)
      }
    }
  })
}

// 查找权限的key是否存在
function findKeyIsExist (menu, key) {
  const filter = {
    key,
    menu
  }
  return Auth.findOne(filter).then(data => {
    if (data) {
      return { code: 'N_000018' }
    } else {
      return { code: '0' }
    }
  })
}

module.exports = {
  addAuth,
  updateAuth,
  removeAuth,
  getAuthList
}
