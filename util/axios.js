'use strict'
const axios = require('axios')

// 创建 axios 实例
const _http = axios.create({
  timeout: 30 * 1000
})

// 添加响应拦截器
_http.interceptors.response.use(response => {
  return response.data
}, (error) => {
  console.log('response error:\n', error)
  return Promise.reject(error)
})

// 封装常用请求方法
const http = {
  get (url, params = {}, headers = {}) {
    const options = {}
    options.params = params
    options.headers = headers
    return _http.get(url, options)
  },
  post (url, params, headers = {}) {
    return _http.post(url, params, { headers })
  },
  put (url, params, headers = {}) {
    return _http.put(url, params, { headers })
  },
  delete (url, params = {}, headers = {}) {
    const options = {}
    options.params = params
    options.headers = headers
    return _http.delete(url, options)
  }
}
module.exports = http
