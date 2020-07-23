const mongoose = require('./connect')

const schema = new mongoose.Schema({
  name: {
    trim: true,
    unique: true,
    type: String,
    required: '{PATH} is required'
  },
  sort: {
    type: Number,
    default: 1,
    required: '{PATH} is required'
  },
  menus: [{
    type: mongoose.Schema.Types.ObjectId
  }]
}, {
  versionKey: false,
  toJSON: { virtuals: true },
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

module.exports = mongoose.model('Role', schema, 'roles')
