const express = require('express')
const router = express.Router()
const jwt = require('../util/token')
const { json } = require('./route_util')

const {
  md5Encrypt,
  getClientIp,
  reverseString
} = require('../util/util')

// 权限认证，验证接口sign、token
router.use((req, res, next) => {
  setHeader(req, res)
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    verifyAuth(req, res, next)
  }
})

// 请求头/跨域设置
function setHeader (req, res) {
  const origin = req.get('Origin') || '*'
  res.header('Access-Control-Allow-Origin', origin)
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Credentials', true) // 是否可以带cookies
  res.header('X-Powered-By', 'Express')
}

function verifyAuth (req, res, next) {
  const ip = getClientIp(req)
  const qid = req.get('qid')
  const sign = req.get('sign')
  const token = req.get('token')
  const payload = jwt.verifyToken(token) || {}
  const signStr = qid + reverseString(JSON.stringify(req.body)) + token
  const publicPath = '^/webHooks/'
  const passTokenPath = ['^/common/getWebToken$', '^/webHooks/']
  const verifySign = new RegExp(publicPath).test(req.url) || md5Encrypt(signStr) === sign
  const verifyToken = new RegExp(passTokenPath.join('|')).test(req.path) || ip === payload.ip

  // 验证接口签名
  if (!verifySign) {
    res.sendStatus(403)
  } else if (!verifyToken) {
    res.json(json({ code: 'N_000015' }))
  } else {
    next()
  }
}

module.exports = router
