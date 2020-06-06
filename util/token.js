const fs = require('fs')
const jwt = require('jsonwebtoken')

// 生成token
function generateToken (data) {
  const key = fs.readFileSync('./pem/rsa_private_key.pem')
  return jwt.sign({
    ...data
  }, key, {
    algorithm: 'RS256',
    expiresIn: 24 * 60 * 60
  })
}

// 校验token
function verifyToken (token) {
  let result = null
  const key = fs.readFileSync('./pem/rsa_public_key.pem')
  jwt.verify(token, key, { algorithms: ['RS256'] }, (err, payload) => {
    if (!err) result = payload
  })
  return result
}

module.exports = {
  generateToken,
  verifyToken
}
