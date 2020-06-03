const express = require('express')
const router = express.Router()
const jwt = require('../util/token')

const {
  md5Encrypt,
  getClientIp,
  reverseString
} = require('../util/util')

// 权限认证，验证接口sign、token
router.use((req, res, next) => {
  const qid = req.get('qid')
  const sign = req.get('sign')
  const token = req.get('token')
  const ip = getClientIp(req)
  const signServer = qid + reverseString(JSON.stringify(req.body)) + token
  const publicPath = ['/webHooks/node']
  const passTokenPath = ['/common/getWebToken']
  const payload = jwt.verifyToken(token) || {}
  const verifyToken = passTokenPath.includes(req.url) || ip === payload.ip
  const verified = publicPath.includes(req.url) || (md5Encrypt(signServer) === sign && verifyToken)

  if (verified) {
    next()
  } else {
    res.sendStatus(403)
  }
})

module.exports = router
