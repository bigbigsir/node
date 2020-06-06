const moment = require('moment')
const morgan = require('morgan')

morgan.token('date', () => {
  return moment().format('YYYY-MM-DD hh:mm:ss')
})

morgan.token('qid', (req) => {
  return req.get('qid')
})

morgan.token('query', (req) => {
  const query = req.query
  const queryStr = JSON.stringify(query)
  if (Object.keys(query).length) {
    return '\nquery=> '.blue + queryStr
  } else {
    return ' '
  }
})

morgan.token('body', (req) => {
  const body = req.body
  const bodyStr = JSON.stringify(body)
  if (Object.keys(body).length) {
    return '\nbody=> '.blue + bodyStr
  } else {
    return ' '
  }
})

const fmt = [
  ':date | ',
  ':remote-addr | ',
  ':url | ',
  ':method | ',
  ':status | ',
  ':response-time ms | ',
  ':qid'.green,
  ':query',
  ':body'
]

morgan.format('pm2', fmt.join(''))

module.exports = morgan('pm2')
