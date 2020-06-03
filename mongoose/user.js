const mongoose = require('./connect')

const schema = new mongoose.Schema({
  username: { type: String }, // 用户账号
  password: { type: String }, // 密码
  age: { type: Number }, // 年龄
  lastLoginDate: { // 最近登录时间
    type: Date,
    default: Date.now
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

module.exports = mongoose.model('User', schema)
