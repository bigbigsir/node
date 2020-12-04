const { createRoute } = require('../route_util')
const {
  addMessage,
  updateMessage,
  removeMessage,
  getMessageList
} = require('./actions')

const routes = [
  {
    method: 'post',
    path: '/addMessage',
    loginAuth: true,
    action: addMessage
  },
  {
    method: 'post',
    path: '/updateMessage',
    loginAuth: true,
    action: updateMessage
  },
  {
    method: 'post',
    path: '/removeMessage',
    loginAuth: true,
    action: removeMessage
  },
  {
    method: 'post',
    path: '/getMessageList',
    loginAuth: true,
    action: getMessageList
  }
]

const router = createRoute(routes)

module.exports = router
