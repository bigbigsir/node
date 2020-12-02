const mongoose = require('./connect')

const schemaType = {
  name: {
    type: String,
    trim: true,
    required: '{PATH} is required'
  },
  path: {
    trim: true,
    unique: true,
    type: String
  },
  sort: {
    type: Number,
    required: '{PATH} is required'
  },
  icon: {
    type: String,
    trim: true
  },
  show: {
    type: Boolean,
    required: '{PATH} is required'
  },
  auths: [{
    ref: 'Auth',
    type: mongoose.Schema.Types.ObjectId
  }],
  parent: {
    ref: 'Menu',
    type: mongoose.Schema.Types.ObjectId
  },
  children: [{
    ref: 'Menu',
    type: mongoose.Schema.Types.ObjectId
  }]
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
schema.post('findOneAndRemove', findOneAndRemove)

function find (next) {
  const auth = {
    path: 'auths',
    select: 'id key name type',
    options: {
      sort: {
        sort: 1
      }
    }
  }
  const options = this.options
  const children = {
    path: 'children',
    select: this._fields,
    options
  }
  const { stopAuthPopulate, stopChildrenPopulate } = options
  if (!stopAuthPopulate) this.populate(auth)
  if (!stopChildrenPopulate) this.populate(children)
  next()
}

function findOneAndRemove (next) {
  const Auth = require('./auth')
  Auth.remove({ _id: { $in: next.auth } }).catch(e => {
    console.log('Menu schema.post findOneAndRemove error:\n' + e)
  })
  Menu.remove({ _id: { $in: next.children } }).catch(e => {
    console.log('Menu schema.post findOneAndRemove error:\n' + e)
  })
}

const Menu = mongoose.model('Menu', schema, 'menus')

module.exports = Menu
