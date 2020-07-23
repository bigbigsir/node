const { createRoute } = require('../route_util')
const {
  webProject,
  nodeProject
} = require('./actions')

const routes = [
  {
    method: 'post',
    path: '/webProject/:key',
    loginAuth: false,
    action: webProject
  },
  {
    method: 'post',
    path: '/nodeProject/:key',
    loginAuth: false,
    action: nodeProject
  }
]

const router = createRoute(routes)

module.exports = router
