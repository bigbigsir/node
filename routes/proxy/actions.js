'use strict'
const http = require('../../util/axios')

function k8Proxy (req) {
  const domain = req.get('domainName')
  const url = domain + req.url
  const method = req.method.toLowerCase()
  const params = method === 'get' ? req.query : req.body
  const headers = {
    V: req.get('V'),
    Qid: req.get('Qid'),
    Sign: req.get('Sign'),
    Token: req.get('Token'),
    AppId: req.get('AppId'),
    DomainName: domain,
    'User-Agent': req.get('User-Agent'),
    'Content-Type': req.get('Content-Type')
  }
  return http[method](url, params, headers).then((data) => {
    return {
      code: '0',
      ...data
    }
  })
}

function ipLocation (req) {
  const method = req.method.toLowerCase()
  const params = method === 'get' ? req.query : req.body
  return getIpLocation(params.ip, method)
}

function getIpLocation (ip, method = 'get') {
  const url = 'https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php'
  const params = {
    t: Date.now(),
    ie: 'utf8',
    oe: 'utf8',
    tn: 'baidu',
    query: ip,
    format: 'json',
    resource_id: '6006'
  }
  return http[method](url, params).then(({ data, status }) => {
    return {
      code: data.length ? '0' : 'N_000020',
      data
    }
  })
}

module.exports = {
  k8Proxy,
  ipLocation,
  getIpLocation
}
