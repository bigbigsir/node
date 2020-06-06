const mongoose = require('mongoose')
const config = require('../config/config')
mongoose.connect(config.dbPath, config.dbOptions)

// 连接成功
mongoose.connection.on('connected', () => {
  console.log(`Mongoose connection open to ${config.dbPath}`.green.bold)
})

// 连接异常
mongoose.connection.on('error', err => {
  console.log(`Mongoose connection error: ${err}`.red.bold)
})

// 连接断开
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected'.red.bold)
})

module.exports = mongoose
