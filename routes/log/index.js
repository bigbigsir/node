const { createRoute } = require('../route_util')
const {
  getLogList
} = require('./actions')

const routes = [
  {
    method: 'post',
    path: '/getLogList',
    loginAuth: true,
    action: getLogList
  }
]

const router = createRoute(routes)

module.exports = router
