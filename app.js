require('colors')
const path = require('path')
const express = require('express')
const createError = require('http-errors')
const cookieParser = require('cookie-parser')
const interfaces = require('os').networkInterfaces()
const logger = require('./util/logger_custom')
const socket = require('socket.io')

const app = express()
const port = process.env.PORT || 3000

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const server = app.listen(port, '0.0.0.0', () => {
  let iPAddress = ''
  for (const devName in interfaces) {
    if (Object.hasOwnProperty.call(interfaces, devName)) {
      interfaces[devName].forEach(alias => {
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          iPAddress = alias.address
        }
      })
    }
  }
  console.log(' App running at: ')
  console.log(' - Local:    ' + `http://localhost:${port}`.underline.green.bold)
  console.log(' - Network:  ' + `http://${iPAddress}:${port}`.underline.green.bold)
})
module.exports.server = server
module.exports.io = socket(server)

app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/common', require('./routes/common'))
app.use('/webHooks', require('./routes/web_hooks'))
require('./mongoose/test')
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  console.log('error handler=>', err)
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})
