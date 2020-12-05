const express = require('express')
const errorCode = require('../config/error_code')
const user = require('./user/actions')
const { getMessage } = require('./message/actions')
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
      const language = String(req.get('language'))

      isPromise(promise) && promise
        .then(result => thenHandel(result))
        .catch(error => catchHandel(error))
        .then(data => formatJson(data, language, res))
    })
  })
  return router
}

// 验证登录权限
function verifyLoginAuth (req, res, next) {
  const language = String(req.get('language'))

  user.verifyLoginAuth(req)
    .then(({ code }) => {
      if (code === '0') return next()
      return thenHandel({ code })
    })
    .catch(error => catchHandel(error))
    .then(data => data && formatJson(data, language, res))
}

// 业务逻辑处理成功
function thenHandel (result) {
  if (isObject(result) && result.code) {
    return result
  } else {
    console.error('thenHandel:\n result must be an object and contain code \ncurrent result => ' + result)
    return {
      code: 'N_000001',
      error: 'result must be an object and contain code'
    }
  }
}

// 业务逻辑处理报错
function catchHandel (error) {
  console.error('catchHandel\n', error)
  return {
    code: 'N_000001',
    error: error.message
  }
}

function formatJson ({ code, ...args }, language, res) {
  code = String(code) === '0' ? 'N_000000' : code
  const data = {
    data: null,
    code: errorCode[code].code,
    message: errorCode[code].message,
    success: String(code) === 'N_000000',
    ...args
  }
  getMessage(code).then(message => {
    if (message && message[language]) data.message = message[language]
  }).catch((e) => {
    console.error('获取提示语失败：\n', e)
  }).finally(() => {
    res.json(data)
    res.locals = data // 返回值记录到日志中
  })
}

module.exports = {
  createRoute
}
