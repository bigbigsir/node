const mongoose = require('./connect')
const Schema = mongoose.Schema
const UserSchema = new Schema({
  username: { type: String }, // 用户账号
  password: { type: String }, // 密码
  age: { type: Number }, // 年龄
  lastLoginDate: {
    type: Date,
    default: new Date()
  } // 最近登录时间
})

module.exports = mongoose.model('User', UserSchema)
