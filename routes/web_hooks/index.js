const { createRoute } = require('../route_util')
const {
  getVersion,
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
  },
  {
    method: 'post',
    path: '/getVersion/:key',
    loginAuth: true,
    action: getVersion
  }
]

const router = createRoute(routes)

module.exports = router
