const moment = require('moment')
const morgan = require('morgan')

morgan.token('date', () => {
  return moment().format('YYYY-MM-DD hh:mm:ss')
})

morgan.token('qid', (req) => {
  return req.get('qid')
})

morgan.token('query', (req) => {
  return JSON.stringify(req.query)
})

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

const fmt = [
  ':date | ',
  ':remote-addr | ',
  ':url | ',
  ':method | ',
  ':status | ',
  ':response-time ms | ',
  ':qid'.blue,
  '\nquery=> :query',
  '\nbody=>  :body'
]

morgan.format('pm2', fmt.join(''))

module.exports = morgan('pm2')
