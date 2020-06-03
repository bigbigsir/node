const { createRoute } = require('../route_util')
const {
  signIn,
  signUp
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
    path: '/signIn123',
    loginAuth: true,
    action (req, res, next) {
      return Promise.resolve({
        code: 0,
        data: 123
      })
    }
  }
]

const router = createRoute(routes)

module.exports = router
