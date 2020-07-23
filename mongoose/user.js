const mongoose = require('./connect')

const schema = new mongoose.Schema({
  username: {
    trim: true,
    unique: true,
    type: String,
    required: '{PATH} is required'
  }, // 用户账号
  password: {
    type: String,
    trim: true,
    required: '{PATH} is required'
  }, // 密码
  email: {
    trim: true,
    unique: true,
    type: String,
    required: '{PATH} is required',
    validate: {
      validator (v) {
        return /^[A-z0-9]+([_.][A-z0-9]+)*@([A-z0-9-]+\.)+[A-z]{2,6}$/.test(v)
      },
      message: '{VALUE} The email address is in the wrong format'
    }
  }, // 邮箱
  role: {
    ref: 'Role',
    type: mongoose.Schema.Types.ObjectId
  },
  age: { type: Number }, // 年龄
  lastLoginDate: { // 最近登录时间
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

module.exports = mongoose.model('User', schema)
