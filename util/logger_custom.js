const moment = require('moment')
const morgan = require('morgan')
const json = require('morgan-json')
const { getClientIp } = require('./util')
const { addLog } = require('../routes/log/actions')

morgan.token('ip', (req) => {
  return getClientIp(req)
})

morgan.token('qid', (req) => {
  return req.get('qid')
})

morgan.token('date', () => {
  return moment().format('YYYY-MM-DD hh:mm:ss')
})

morgan.token('body', (req) => {
  const body = req.body
  const bodyStr = JSON.stringify(body)
  if (Object.keys(body).length) {
    return bodyStr
  } else {
    return ''
  }
})

morgan.token('query', (req) => {
  const query = req.query
  const queryStr = JSON.stringify(query)
  if (Object.keys(query).length) {
    return queryStr
  } else {
    return ''
  }
})

morgan.token('response', (req, res) => {
  const response = res.locals
  // response.data = Object.prototype.toString.call(response.data)
  const responseStr = JSON.stringify(response)
  if (Object.keys(response).length) {
    return responseStr
  } else {
    return ''
  }
})

const fmt = [
  ':date | ',
  ':ip | ',
  ':url | ',
  ':method | ',
  ':status | ',
  ':res[content-length] | ',
  ':response-time ms | ',
  ':qid',
  ':query',
  ':body'
  // ':response'
]

const formatJson = json({
  date: ':date',
  ip: ':ip',
  qid: ':qid',
  url: ':url',
  body: ':body',
  query: ':query',
  method: ':method',
  status: ':status',
  response: ':response',
  responseTime: ':response-time',
  contentLength: ':res[content-length]'
})

morgan.format('pm2', fmt.join(':date'))

const logger = morgan(formatJson, {
  skip (req) {
    return req.method === 'OPTIONS' || req.originalUrl === '/log/getLogList'
  },
  stream: {
    write (log) {
      addLog(JSON.parse(log))
    }
  }
})

module.exports = logger
