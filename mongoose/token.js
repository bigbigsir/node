const mongoose = require('./connect')

const schema = new mongoose.Schema({
  appId: {
    type: String
  },
  token: { type: String },
  username: { type: String },
  invalid: {
    type: Boolean,
    default: false
  },
  exp: { // 设置TTL, 30分钟后失效自动删除
    type: Date,
    default: Date.now,
    index: { expires: 30 * 60 }
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

module.exports = mongoose.model('Token', schema)
