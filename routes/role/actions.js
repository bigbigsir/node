const Role = require('../../mongoose/role')
const { formatSortJson } = require('../../util/util')

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
  return Role.findByIdAndUpdate(id, req.body, ops).then(() => {
    return { code: '0' }
  })
}

// 删除角色
function removeRole (req) {
  const { id } = req.body
  return Role.findByIdAndRemove(id).then(() => {
    return { code: '0' }
  })
}

// 获取角色列表
function getRoleList (req) {
  let { sort, page, pageSize, name, ...filter } = req.body
  const options = {
    sort: formatSortJson(sort),
    stopAuthPopulate: true
  }

  page = parseInt(page) || 1
  pageSize = parseInt(pageSize) || 10

  name && (filter.name = { $regex: name })
  delete filter.loginName

  return Promise.all([
    Role.countDocuments(filter),
    Role.find(filter, undefined, options).skip((page - 1) * pageSize).limit(pageSize)
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

// 获取所有角色
function getAllRole () {
  const options = {
    sort: {
      sort: 1
    },
    stopAuthPopulate: true
  }
  return Role.find(undefined, 'id name', options).then(data => ({
    data,
    code: '0'
  }))
}

module.exports = {
  addRole,
  updateRole,
  removeRole,
  getRoleList,
  getAllRole
}
