const mongoose = require('./connect')

const schemaType = {
  role: {
    ref: 'Role',
    type: mongoose.Schema.Types.ObjectId
  }, // 角色id
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
  creator: {
    type: String
  }, // 创建人
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
  createMethod: { type: String },
  lastLoginDate: { // 最近登录时间
    type: Date,
    default: Date.now
  } // 最后登录时间
}
const schemaOptions = {
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
}

const schema = new mongoose.Schema(schemaType, schemaOptions)

module.exports = mongoose.model('User', schema)
