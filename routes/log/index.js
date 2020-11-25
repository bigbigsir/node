const { createRoute } = require('../route_util')
const {
  removeLog,
  removeLogs,
  getLogList
} = require('./actions')

const routes = [
  {
    method: 'post',
    path: '/getLogList',
    loginAuth: true,
    action: getLogList
  },
  {
    method: 'post',
    path: '/removeLog',
    loginAuth: true,
    action: removeLog
  },
  {
    method: 'post',
    path: '/removeLogs',
    loginAuth: true,
    action: removeLogs
  }
]

const router = createRoute(routes)

module.exports = router
