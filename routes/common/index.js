const { createRoute } = require('../route_util')
const { getWebToken } = require('./actions')

const routes = [
  {
    method: 'post',
    path: '/getWebToken',
    loginAuth: false,
    action: getWebToken
  }
]

const router = createRoute(routes)

module.exports = router
