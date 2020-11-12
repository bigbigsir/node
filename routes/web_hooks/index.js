const { createRoute } = require('../route_util')
const {
  getVersion,
  updateForGitHub
} = require('./actions')

const routes = [
  {
    method: 'post',
    path: '/updateForGitHub/:key',
    loginAuth: false,
    action: updateForGitHub
  },
  {
    method: 'post',
    path: '/getVersion',
    loginAuth: true,
    action: getVersion
  }
]

const router = createRoute(routes)

module.exports = router
