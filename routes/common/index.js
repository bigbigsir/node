const { createRoute } = require('../route_util')
const {
  createCaptcha,
  verifyCaptcha,
  createWebToken
} = require('./actions')

const routes = [
  {
    method: 'post',
    path: '/getWebToken',
    loginAuth: false,
    action: createWebToken
  },
  {
    method: 'post',
    path: '/getCaptcha',
    loginAuth: false,
    action: createCaptcha
  },
  {
    method: 'post',
    path: '/verifyCaptcha',
    loginAuth: false,
    action: verifyCaptcha
  }
]

const router = createRoute(routes)

module.exports = router
