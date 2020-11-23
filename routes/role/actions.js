const Role = require('../../mongoose/role')

// 添加角色
function addRole (req) {
  const body = req.body
  return new Role(body).save().then(data => {
    return {
      code: '0',
      data
    }
  }).catch((error) => ({
    error,
    code: 'N_000010'
  }))
}

// 更新角色
function updateRole (req) {
  const { id } = req.body
  const ops = {
    new: true,
    runValidators: true
  }
  return Role.findByIdAndUpdate(id, req.body, ops).then(data => {
    return {
      data,
      code: '0'
    }
  })
}

// 获取角色列表
function getRoleList (req) {
  let { page, pageSize } = req.body
  const options = {
    sort: {
      sort: 1
    }
  }
  page = parseInt(page) || 1
  pageSize = parseInt(pageSize) || 10
  return Promise.all([
    Role.count(),
    Role.find(undefined, undefined, options).skip((page - 1) * pageSize).limit(pageSize)
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

// 获取所有角色
function getAllRole () {
  return Role.find(undefined, 'id name').then(data => ({
    data,
    code: '0'
  }))
}

// 添加角色
function removeRole (req) {
  const { id } = req.body
  return Role.findByIdAndRemove(id).then(() => {
    return { code: '0' }
  })
}

module.exports = {
  addRole,
  updateRole,
  removeRole,
  getRoleList,
  getAllRole
}
