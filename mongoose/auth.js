const mongoose = require('./connect')

const schemaType = {
  key: {
    trim: true,
    type: String,
    required: '{PATH} is required'
  },
  name: {
    trim: true,
    type: String,
    required: '{PATH} is required'
  },
  sort: {
    type: Number,
    required: '{PATH} is required'
  },
  menu: {
    ref: 'Menu',
    type: mongoose.Schema.Types.ObjectId,
    required: '{PATH} is required'
  },
  type: {
    type: String,
    default: 'auth'
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

schema.post('save', save)
schema.post('findOneAndRemove', findOneAndRemove)

function save (next) {
  const Menu = require('./menu')
  const addAuth = { $addToSet: { auths: next._id } }
  Menu.findByIdAndUpdate(next.menu, addAuth).catch(e => {
    console.log('Auth schema.post save error:\n' + e)
  })
}

function findOneAndRemove (next) {
  const Menu = require('./menu')
  const removeAuth = { $pull: { auths: next._id } }
  Menu.findByIdAndUpdate(next.menu, removeAuth).catch(e => {
    console.log('Auth schema.post findOneAndRemove error:\n' + e)
  })
}

module.exports = mongoose.model('Auth', schema, 'auths')
