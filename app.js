require('colors')
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const interfaces = require('os').networkInterfaces()

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

const port = 3000
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  console.log(err)
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.listen(port, () => {
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

module.exports = app
