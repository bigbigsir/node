const express = require('express')
const errorCode = require('../config/error_code')
const { verifyLoginAuth } = require('./users/actions')

/**
 * @description 生成中间件路由，统一数据返回格式
 * @param {Array} routes 路由配置
 * @return router
 * 返回前端数据格式：
 * {
 *   code：处理结果状态
 *   data：返回的数据
 *   message：返回消息
 * }
 * */
function createRoute (routes = []) {
  const router = express.Router()
  routes.forEach(item => {
    router[item.method](item.path, (req, res, next) => {
      let promise
      if (item.loginAuth) {
        promise = verifyLoginAuth(req).then(({ code }) => {
          if (code === '0') {
            return item.action(req, res, next)
          }
          return Promise.resolve({ code })
        })
      } else {
        promise = item.action(req, res, next)
      }
      promise.then(({ code, ...args }) => {
        res.json({
          code,
          data: null,
          message: errorCode[code].message,
          ...args
        })
      }).catch(e => {
        console.error(e)
        res.json({
          data: null,
          code: errorCode.N_000001.code,
          message: errorCode.N_000001.message
        })
      })
    })
  })
  return router
}

module.exports = {
  createRoute
}
