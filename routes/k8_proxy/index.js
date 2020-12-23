const { createRoute } = require('../route_util')
const {
  K8Proxy
} = require('./actions')

const routes = [
  {
    path: '/',
    method: 'use',
    loginAuth: false,
    action: K8Proxy
  }
]

const router = createRoute(routes)

module.exports = router
