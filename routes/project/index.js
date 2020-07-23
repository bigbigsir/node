const { createRoute } = require('../route_util')
const {
  addProject,
  getProjects,
  updateProject,
  removeProject,
  getProjectList
} = require('./actions')

const routes = [
  {
    method: 'post',
    path: '/addProject',
    loginAuth: true,
    action: addProject
  },
  {
    method: 'post',
    path: '/getProjects',
    loginAuth: true,
    action: getProjects
  },
  {
    method: 'post',
    path: '/updateProject',
    loginAuth: true,
    action: updateProject
  },
  {
    method: 'post',
    path: '/removeProject',
    loginAuth: true,
    action: removeProject
  },
  {
    method: 'post',
    path: '/getProjectList',
    loginAuth: true,
    action: getProjectList
  }
]

const router = createRoute(routes)

module.exports = router
