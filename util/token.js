const fs = require('fs')
const jwt = require('jsonwebtoken')

// 生成token
function generateToken () {
  const key = fs.readFileSync('./pem/rsa_private_key.pem')
  const date = Date.now() / 1000
  return jwt.sign({
    iat: date
  }, key, { algorithm: 'RS256' })
}

// 校验token
function verifyToken (token, cb) {
  const key = fs.readFileSync('./pem/rsa_public_key.pem')
  jwt.verify(token, key, { algorithms: ['RS256'] }, cb)
}

module.exports = {
  generateToken,
  verifyToken
}
