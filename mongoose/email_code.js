const mongoose = require('./connect')

const expTime = 15

const schema = new mongoose.Schema({
  exp: { // 设置TTL, 15分钟后失效自动删除
    type: Date,
    default: Date.now,
    index: { expires: expTime * 60 }
  },
  email: {
    type: String,
    required: true
  },
  captcha: {
    type: String,
    required: true
  },
  emailType: {
    type: String,
    required: true
  }
}, {
  versionKey: false,
  toJSON: { virtuals: true }
})

module.exports = {
  exp: expTime,
  EmailCode: mongoose.model('EmailCode', schema, 'email_codes')
}
