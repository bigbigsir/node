const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

/**
 * @description 解密RSA密文
 * @param {string} cipherText 密文
 * @return {string} 解密后的原文
 * */
function privateDecrypt (cipherText) {
  const privateKey = fs.readFileSync(path.resolve('./pem/rsa_private_key.pem')).toString()
  const buffer = Buffer.from(cipherText, 'base64')
  const decrypted = crypto.privateDecrypt({
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_PADDING
  }, buffer)
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
    req.connection.socket.remoteAddress || ''
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
function md5Sign (str) {
  return crypto.createHash('md5').update(str, 'utf8').digest('hex')
}

module.exports = {
  md5Sign,
  getClientIp,
  reverseString,
  privateDecrypt
}
