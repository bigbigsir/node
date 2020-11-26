const mongoose = require('./connect')

const schemaType = {
  name: {
    trim: true,
    unique: true,
    type: String,
    required: '{PATH} is required'
  },
  sort: {
    type: Number,
    required: '{PATH} is required'
  },
  auths: [{
    ref: 'Auth',
    type: mongoose.Schema.Types.ObjectId
  }],
  menus: [{
    type: mongoose.Schema.Types.ObjectId
  }],
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
schema.pre('find', find)

function find (next) {
  const auth = {
    path: 'auths',
    select: '-created -updated'
  }
  const { stopAuthPopulate } = this.options
  if (!stopAuthPopulate) this.populate(auth)
  next()
}

module.exports = mongoose.model('Role', schema, 'roles')
