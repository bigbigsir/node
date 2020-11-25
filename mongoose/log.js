const mongoose = require('./connect')

const schema = new mongoose.Schema({
  date: String,
  ip: String,
  qid: String,
  url: String,
  body: String,
  query: String,
  method: String,
  status: String,
  response: String,
  responseTime: String,
  contentLength: String,
  exp: { // 设置TTL, 10日后自动删除
    type: Date,
    default: Date.now,
    index: { expires: 10 * 24 * 60 * 60 }
  }
}, {
  toJSON: { virtuals: true },
  versionKey: false,
  timestamps: {
    createdAt: 'created'
  }
})

module.exports = mongoose.model('Log', schema, 'logs')
