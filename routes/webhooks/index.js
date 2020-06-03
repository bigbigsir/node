const { createRoute } = require('../route_util')
const { updateProjectNode } = require('./actions')

const routes = [
  {
    method: 'post',
    path: '/node',
    loginAuth: false,
    action: updateProjectNode
  }
]

const router = createRoute(routes)

module.exports = router
