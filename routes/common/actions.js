const jwt = require('../../util/token')
const { getClientIp } = require('../../util/util')

// 获取token
function getWebToken (req) {
  const ip = getClientIp(req)
  const token = jwt.generateToken({ ip })
  return Promise.resolve({
    code: '0',
    data: token
  })
}

module.exports = {
  getWebToken
}
