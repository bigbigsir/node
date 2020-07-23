const { createRoute } = require('../route_util')
const {
  getEmailCode
} = require('./actions')

const routes = [
  {
    method: 'post',
    path: '/getEmailCode',
    loginAuth: false,
    action: getEmailCode
  }
]

const router = createRoute(routes)

module.exports = router
