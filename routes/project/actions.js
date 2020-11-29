const Project = require('../../mongoose/project')
const { formatSortJson } = require('../../util/util')

// 添加项目
function addProject (req) {
  const body = req.body
  return new Project(body).save().then(data => {
    return {
      code: '0',
      data
    }
  }).catch((error) => ({
    error,
    code: 'N_000010'
  }))
}

// 更新项目
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

// 获取项目列表
function getProjectList (req) {
  let { sort, page, pageSize } = req.body
  const options = {
    sort: formatSortJson(sort)
  }
  page = parseInt(page) || 1
  pageSize = parseInt(pageSize) || 10
  return Promise.all([
    Project.count(),
    Project.find(undefined, undefined, options).skip((page - 1) * pageSize).limit(pageSize)
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

// 获取所有项目
function getProjects () {
  return Project.find().then(data => ({
    data,
    code: '0'
  }))
}

// 删除项目
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
