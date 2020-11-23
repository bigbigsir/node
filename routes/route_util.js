const express = require('express')
const errorCode = require('../config/error_code')
const { verifyLoginAuth } = require('./users/actions')
const { isPromise } = require('../util/util')

/**
 * @description 生成中间件路由，统一数据返回格式
 * @param {Array} routes 路由配置
 * @return Router
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
    router[item.method](item.path, verifyAuth(item.loginAuth), (req, res, next) => {
      const promise = item.action(req, res, next)
      isPromise(promise) && promise.then(data => {
        res.locals = json(data) // 返回值记录到日志中
        res.json(json(data))
      }).catch(e => {
        console.error(e)
        res.json(json({
          code: 'N_000001',
          error: e
        }))
      })
    })
  })
  return router
}

function verifyAuth (isVerify) {
  return (req, res, next) => {
    if (isVerify) {
      verifyLoginAuth(req).then(({ code }) => {
        if (code === '0') {
          next()
        } else {
          res.json(json({ code }))
        }
      }).catch(e => {
        console.log(e)
        res.json(json({ code: 'N_000001' }))
      })
    } else {
      next()
    }
  }
}

function json ({ code, ...args }) {
  return {
    data: null,
    code: errorCode[code].code,
    message: errorCode[code].message,
    success: String(code) === '0',
    ...args
  }
}

module.exports = {
  json,
  createRoute
}
