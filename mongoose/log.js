const mongoose = require('./connect')

const schemaType = {
  ip: String,
  qid: String,
  url: String,
  body: String,
  query: String,
  method: String,
  status: Number,
  response: String,
  timestamp: Date,
  responseTime: Number,
  contentLength: Number,
  exp: { // 设置TTL, 10日后自动删除
    type: Date,
    default: Date.now,
    index: { expires: 10 * 24 * 60 * 60 }
  }
}
const schemaOptions = {
  toJSON: { virtuals: true },
  versionKey: false,
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
}

const schema = new mongoose.Schema(schemaType, schemaOptions)

module.exports = mongoose.model('Log', schema, 'logs')
