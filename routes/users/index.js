const { createRoute } = require('../route_util')
const {
  signIn,
  signUp,
  signOut,
  getUserInfo
} = require('./actions')

const routes = [
  {
    method: 'post',
    path: '/signIn',
    loginAuth: false,
    action: signIn
  },
  {
    method: 'post',
    path: '/signUp',
    loginAuth: false,
    action: signUp
  },
  {
    method: 'post',
    path: '/signOut',
    loginAuth: true,
    action: signOut
  },
  {
    method: 'post',
    path: '/getUserInfo',
    loginAuth: true,
    action: getUserInfo
  }
]

const router = createRoute(routes)

module.exports = router
