const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const sortMap = {
  ascend: 1,
  descend: -1
}

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
    decrypted = cipherText
  }

  return decrypted.toString()
}

/**
 * @description 获取客户端ip
 * @return {string}
 * */
function getClientIp (req) {
  let ip = req.get('x-forwarded-for')
  ip = ip && ip.split(',')[0]
  return ip ||
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
 * @description 生成指定位数随机数字
 * @param {Number} count 生成位数
 * @return {String}
 */
function random (count = 6) {
  const random = String(Math.random()).slice(-count)
  return random.toString()
}

/**
 * @description 判断入参是否为Promise
 * @param {*} target
 * @return {boolean}
 */
function isPromise (target) {
  return Object.prototype.toString.call(target) === '[object Promise]'
}

/**
 * @description 判断参数是否为对象
 * @param  {*} target
 * @return {boolean}
 */
function isObject (target) {
  return Object.prototype.toString.call(target) === '[object Object]'
}

/**
 * @description 将前端传递的排序数据格式化
 * @param  {Object|undefined} sort
 * @return {Object|undefined}
 */
function formatSortJson (sort) {
  sort = isObject(sort) && Object.keys(sort).length ? { ...sort } : undefined
  if (sort) {
    for (const key in sort) {
      if (Object.hasOwnProperty.call(sort, key)) {
        sort[key] = sortMap[sort[key]] || 1
      }
    }
  }
  return sort
}

module.exports = {
  sortMap,
  random,
  isObject,
  isPromise,
  md5Encrypt,
  getClientIp,
  reverseString,
  privateDecrypt,
  formatSortJson
}
