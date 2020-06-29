const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

/**
 * @description 解密RSA密文
 * @param {string} cipherText 密文
 * @return {string} 解密后的原文
 * */
function privateDecrypt (cipherText = '') {
  let decrypted
  const privateKey = fs.readFileSync(path.resolve('./pem/rsa_private_key.pem')).toString()
  const buffer = Buffer.from(cipherText, 'base64')
  try {
    decrypted = crypto.privateDecrypt({
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING
    }, buffer)
  } catch (e) {
    console.log(e.reason)
    decrypted = cipherText
  }

  return decrypted.toString()
}

/**
 * @description 获取客户端ip
 * @return {string}
 * */
function getClientIp (req) {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress ||
    null
}

/**
 * @description 倒叙字符串
 * @param {string} str
 * @return {String}
 */
function reverseString (str = '') {
  return (str + '').split('').sort().reverse().join('')
}

/**
 * @description MD5加密
 * @param {string} str
 * @return {String}
 */
function md5Encrypt (str) {
  return crypto.createHash('md5').update(str, 'utf8').digest('hex')
}

/**
 * @description 生成指定位数随机数
 * @param {Number} count 生成位数
 * @return {String}
 */
function random (count = 6) {
  const random = Math.floor(Math.random() * (1 + '0'.repeat(count)))
  return random.toString()
}

/**
 * @description 判断入参是否为Promise
 * @param {Promise} promise
 * @return {boolean}
 */
function isPromise(promise) {
  return promise && Object.prototype.toString.call(promise) === '[object Promise]'
}

module.exports = {
  random,
  isPromise,
  md5Encrypt,
  getClientIp,
  reverseString,
  privateDecrypt
}
