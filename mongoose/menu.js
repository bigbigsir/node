const mongoose = require('./connect')

const schema = new mongoose.Schema({
  path: {
    trim: true,
    type: String
  },
  name: {
    type: String,
    trim: true,
    required: '{PATH} is required'
  },
  sort: {
    type: Number,
    required: '{PATH} is required'
  },
  icon: {
    type: String,
    trim: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    default: null
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu'
  }]
}, {
  versionKey: false,
  toJSON: { virtuals: true },
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

schema.pre('find', function (next) {
  this.populate({
    path: 'children',
    select: '-created -updated',
    options: {
      sort: {
        sort: 1
      }
    }
  })
  next()
})

schema.post('findOneAndRemove', function (next) {
  next && next.children.forEach(id => {
    Menu.findByIdAndRemove(id).then(data => {
      console.log('post findByIdAndRemove', data._id)
    }).catch(e => {
      console.log(e)
    })
  })
})

const Menu = mongoose.model('Menu', schema, 'menus')
module.exports = Menu
