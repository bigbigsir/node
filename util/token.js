const fs = require('fs')
const jwt = require('jsonwebtoken')

// 生成token
function generateToken (data) {
  const key = fs.readFileSync('./pem/rsa_private_key.pem')
  const iat = Math.floor(Date.now() / 1000)
  return jwt.sign({
    iat,
    ...data
  }, key, { algorithm: 'RS256' })
}

// 校验token
function verifyToken (token) {
  let result
  const key = fs.readFileSync('./pem/rsa_public_key.pem')
  jwt.verify(token, key, { algorithms: ['RS256'] }, (err, payload) => {
    if (err) {
      result = null
    } else {
      result = payload
    }
  })
  return result
}

module.exports = {
  generateToken,
  verifyToken
}
