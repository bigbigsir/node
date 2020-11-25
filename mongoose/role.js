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
    required: '{PATH} is required'
  },
  menus: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  description: {
    trim: true,
    type: String
  }
}, {
  versionKey: false,
  toJSON: { virtuals: true },
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

module.exports = mongoose.model('Role', schema, 'roles')
