const { createRoute } = require('../route_util')
const {
  addMenu,
  getMenus,
  removeMenu,
  updateMenu,
  getMenusAndAuths,
  updateMenuStatus
} = require('./actions')

const routes = [
  {
    method: 'post',
    path: '/addMenu',
    loginAuth: true,
    action: addMenu
  }, {
    method: 'post',
    path: '/getMenus',
    loginAuth: true,
    action: getMenus
  }, {
    method: 'post',
    path: '/removeMenu',
    loginAuth: true,
    action: removeMenu
  }, {
    method: 'post',
    path: '/updateMenu',
    loginAuth: true,
    action: updateMenu
  }, {
    method: 'post',
    path: '/getMenusAndAuths',
    loginAuth: true,
    action: getMenusAndAuths
  }, {
    method: 'post',
    path: '/updateMenuStatus',
    loginAuth: true,
    action: updateMenuStatus
  }
]

const router = createRoute(routes)

module.exports = router
