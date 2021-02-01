const jwt = require('../../util/token')
const { md5Encrypt, reverseString } = require('../../util/util')

// 设置响应头
function setHeader (req, res) {
  const origin = req.get('Origin') || '*'
  res.header('Access-Control-Allow-Origin', origin)
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Credentials', false) // 是否可以带cookies
  res.header('X-Powered-By', 'Express')
}

// 验证接口Sign和Token的有效性
function verifyAuth (req, res, next) {
  const qid = req.get('qid')
  const sign = req.get('sign')
  const data = /GET|DELETE/.test(String(req.method)) ? req.query : req.body
  const appId = req.get('app-id')
  const token = req.get('token')
  const payload = jwt.verifyToken(token) || {}
  const signStr = qid + reverseString(JSON.stringify(data))
  const publicPath = ['^/webHooks/', '^/proxy/k8/']
  const passTokenPath = ['^/webHooks/', '^/proxy/k8/', '^/common/getWebToken$']
  const verifySign = new RegExp(publicPath.join('|')).test(req.url) || md5Encrypt(signStr) === sign
  const verifyToken = new RegExp(passTokenPath.join('|')).test(req.path) || appId === payload.appId

  if (!verifySign) { // 验证接口签名
    res.sendStatus(403)
  } else if (!verifyToken) { // 验证Token是否有效
    return Promise.resolve({ code: 'N_000015' })
  } else {
    next()
  }
}

function setHeaderAndVerify (req, res, next) {
  setHeader(req, res)
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    return verifyAuth(req, res, next)
  }
}

module.exports = {
  setHeaderAndVerify
}
