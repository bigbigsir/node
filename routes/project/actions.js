const Project = require('../../mongoose/project')

// 添加项目
function addProject (req) {
  const body = req.body
  return new Project(body).save().then(data => {
    return {
      code: '0',
      data
    }
  })
}

// 更新角色
function updateProject (req) {
  const { id } = req.body
  const ops = {
    new: true,
    runValidators: true
  }
  return Project.findByIdAndUpdate(id, req.body, ops).then(data => {
    return {
      data,
      code: '0'
    }
  })
}

// 获取角色列表
function getProjectList (req) {
  let { page, pageSize } = req.body
  page = parseInt(page) || 1
  pageSize = parseInt(pageSize) || 10
  return Promise.all([
    Project.count(),
    Project.find().skip((page - 1) * pageSize).limit(pageSize)
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
function getProjects () {
  return Project.find().then(data => ({
    data,
    code: '0'
  }))
}

// 添加角色
function removeProject (req) {
  const { id } = req.body
  return Project.findByIdAndRemove(id).then(() => {
    return { code: '0' }
  })
}

module.exports = {
  addProject,
  getProjects,
  updateProject,
  removeProject,
  getProjectList
}