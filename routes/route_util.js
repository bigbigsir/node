const express = require('express')
const errorCode = require('../config/error_code')
const user = require('./user/actions')
const { isObject, isPromise } = require('../util/util')

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
    const fns = []
    item.loginAuth && fns.push(verifyLoginAuth)
    router[item.method](item.path, ...fns, (req, res, next) => {
      const promise = item.action(req, res, next)
      isPromise(promise) && promise
        .then(result => thenHandel(result, res))
        .catch(error => catchHandel(error, res))
    })
  })
  return router
}

// 验证登录权限
function verifyLoginAuth (req, res, next) {
  user.verifyLoginAuth(req).then(({ code }) => {
    if (code === '0') return next()
    thenHandel({ code }, res)
  }).catch(e => catchHandel(e, res))
}

function thenHandel (result, res) {
  const data = formatJson(isObject(result) ? result : undefined)
  res.json(data)
  res.locals = data // 返回值记录到日志中
  !isObject(result) && console.error('result must be an object and contain code \ncurrent result => ' + result)
}

function catchHandel (error, res) {
  const data = formatJson({
    code: 'N_000001',
    error: error.message
  })
  res.json(data)
  res.locals = data // 返回值记录到日志中
  console.error(error)
}

function formatJson ({ code, ...args } = { code: 'N_000001' }) {
  return {
    data: null,
    code: errorCode[code].code,
    message: errorCode[code].message,
    success: String(code) === '0',
    ...args
  }
}

module.exports = {
  createRoute
}
