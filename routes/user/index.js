const { createRoute } = require('../route_util')
const {
  signIn,
  signUp,
  signOut,
  addUser,
  removeUser,
  updateUser,
  getUserInfo,
  getUserList,
  restPassword
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
    path: '/addUser',
    loginAuth: true,
    action: addUser
  },
  {
    method: 'post',
    path: '/updateUser',
    loginAuth: true,
    action: updateUser
  },
  {
    method: 'post',
    path: '/removeUser',
    loginAuth: true,
    action: removeUser
  },
  {
    method: 'post',
    path: '/getUserInfo',
    loginAuth: true,
    action: getUserInfo
  },
  {
    method: 'post',
    path: '/getUserList',
    loginAuth: true,
    action: getUserList
  },
  {
    method: 'post',
    path: '/restPassword',
    loginAuth: true,
    action: restPassword
  }
]

const router = createRoute(routes)

module.exports = router
