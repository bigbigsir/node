require('colors')
const path = require('path')
const express = require('express')
const createError = require('http-errors')
const cookieParser = require('cookie-parser')
const interfaces = require('os').networkInterfaces()
const logger = require('./util/logger_custom')

const app = express()
const port = process.env.PORT || 3100

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/index'))
app.use('/log', require('./routes/log'))
app.use('/role', require('./routes/role'))
app.use('/menu', require('./routes/menu'))
app.use('/users', require('./routes/users'))
app.use('/email', require('./routes/email'))
app.use('/common', require('./routes/common'))
app.use('/project', require('./routes/project'))
app.use('/webHooks', require('./routes/web_hooks'))

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

app.listen(port, '0.0.0.0', () => {
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
