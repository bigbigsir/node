const { createRoute } = require('../route_util')
const {
  addRole,
  updateRole,
  removeRole,
  getRoleList,
  getAllRole
} = require('./actions')

const routes = [
  {
    method: 'post',
    path: '/addRole',
    loginAuth: true,
    action: addRole
  },
  {
    method: 'post',
    path: '/updateRole',
    loginAuth: true,
    action: updateRole
  },
  {
    method: 'post',
    path: '/removeRole',
    loginAuth: true,
    action: removeRole
  },
  {
    method: 'post',
    path: '/getRoleList',
    loginAuth: true,
    action: getRoleList
  },
  {
    method: 'post',
    path: '/getAllRole',
    loginAuth: true,
    action: getAllRole
  }
]

const router = createRoute(routes)

module.exports = router
