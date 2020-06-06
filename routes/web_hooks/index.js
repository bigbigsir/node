const { createRoute } = require('../route_util')
const {
  projectNode,
  projectReactWeb
} = require('./actions')

const routes = [
  {
    method: 'post',
    path: '/projectNode',
    loginAuth: false,
    action: projectNode
  },
  {
    method: 'post',
    path: '/projectReactWeb',
    loginAuth: false,
    action: projectReactWeb
  }
]

const router = createRoute(routes)

module.exports = router
