'use strict'
const http = require('../../util/axios')

function K8Proxy (req) {
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

module.exports = {
  K8Proxy
}
