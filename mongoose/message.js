const mongoose = require('./connect')

const schemaType = {
  zhCN: {
    trim: true,
    type: String
  },
  zhTW: {
    trim: true,
    type: String
  },
  enUS: {
    trim: true,
    type: String
  },
  code: {
    trim: true,
    unique: true,
    type: String,
    required: '{PATH} is required'
  },
  serial: {
    unique: true,
    type: Number,
    required: '{PATH} is required'
  },
  creator: {
    type: String
  },
  description: {
    trim: true,
    type: String
  }
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

module.exports = mongoose.model('Message', schema, 'messages')
