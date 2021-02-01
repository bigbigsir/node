const { createRoute } = require('../route_util')
const {
  k8Proxy,
  ipLocation
} = require('./actions')

const routes = [
  {
    path: '/k8',
    method: 'use',
    loginAuth: false,
    action: k8Proxy
  },
  {
    path: '/ipLocation',
    method: 'use',
    loginAuth: false,
    action: ipLocation
  }
]

const router = createRoute(routes)

module.exports = router
