const { createRoute } = require('../route_util')
const {
  addAuth,
  updateAuth,
  removeAuth,
  getAuthList
} = require('./actions')

const routes = [
  {
    method: 'post',
    path: '/addAuth',
    loginAuth: true,
    action: addAuth
  }, {
    method: 'post',
    path: '/updateAuth',
    loginAuth: true,
    action: updateAuth
  }, {
    method: 'post',
    path: '/removeAuth',
    loginAuth: true,
    action: removeAuth
  }, {
    method: 'post',
    path: '/getAuthList',
    loginAuth: true,
    action: getAuthList
  }
]

const router = createRoute(routes)

module.exports = router
