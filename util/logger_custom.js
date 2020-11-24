const moment = require('moment')
const morgan = require('morgan')
const { getClientIp } = require('./util')

morgan.token('date', () => {
  return moment().format('YYYY-MM-DD hh:mm:ss')
})

morgan.token('ip', (req) => {
  return getClientIp(req)
})

morgan.token('qid', (req) => {
  return req.get('qid')
})

morgan.token('query', (req) => {
  const query = req.query
  const queryStr = JSON.stringify(query)
  if (Object.keys(query).length) {
    return '\nrequest_query=> ' + queryStr
  } else {
    return ' '
  }
})

morgan.token('body', (req) => {
  const body = req.body
  const bodyStr = JSON.stringify(body)
  if (Object.keys(body).length) {
    return '\nrequest_body=> ' + bodyStr
  } else {
    return ' '
  }
})

morgan.token('response', (req, res) => {
  const response = res.locals
  const responseStr = JSON.stringify(response)
  if (Object.keys(response).length) {
    return '\nresponse=> ' + responseStr
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

morgan.format('pm2', fmt.join(''))

module.exports = morgan
