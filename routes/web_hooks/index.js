const { createRoute } = require('../route_util')
const {
  use,
  projectNode,
  projectVueH5,
  projectReactWeb
} = require('./actions')

const routes = [
  {
    method: 'use',
    path: '/',
    action: use
  },
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
  },
  {
    method: 'post',
    path: '/projectVueH5',
    loginAuth: false,
    action: projectVueH5
  }
]

const router = createRoute(routes)

module.exports = router
