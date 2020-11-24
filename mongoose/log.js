const mongoose = require('./connect')

const schema = new mongoose.Schema({
  log: {
    trim: true,
    type: String
  },
  exp: { // 设置TTL, 30日后自动删除
    type: Date,
    default: Date.now,
    index: { expires: 30 * 24 * 60 * 60 }
  }
}, {
  versionKey: false,
  timestamps: {
    createdAt: 'created'
  }
})

module.exports = mongoose.model('Log', schema, 'logs')
