const { createRoute } = require('../route_util')
const { setHeaderAndVerify } = require('./actions')

const routes = [
  {
    method: 'use',
    path: '/',
    loginAuth: false,
    action: setHeaderAndVerify
  }
]

const router = createRoute(routes)

module.exports = router
