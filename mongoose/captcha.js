const mongoose = require('./connect')

const schema = new mongoose.Schema({
  captcha: {
    type: String,
    required: true,
    lowercase: true
  },
  exp: { // 设置TTL, 15分钟后失效自动删除
    type: Date,
    default: Date.now,
    index: { expires: 15 * 60 }
  }
}, {
  versionKey: false
})

module.exports = mongoose.model('Captcha', schema)
