const mongoose = require('./connect')

const schema = new mongoose.Schema({
  key: {
    trim: true,
    type: String,
    unique: true,
    required: '{PATH} is required'
  },
  type: {
    trim: true,
    type: String,
    required: '{PATH} is required',
    validate: {
      validator (v) {
        const types = ['Web', 'Node']
        return types.includes(v)
      },
      message: 'type must be Web | Node'
    }
  },
  name: {
    trim: true,
    type: String,
    required: '{PATH} is required'
  },
  secret: {
    trim: true,
    type: String,
    required: '{PATH} is required'
  },
  describe: {
    trim: true,
    type: String
  },
  shellPath: {
    trim: true,
    type: String,
    required: '{PATH} is required'
  },
  projectDir: {
    trim: true,
    type: String,
    required: '{PATH} is required'
  }
}, {
  versionKey: false,
  toJSON: { virtuals: true },
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

module.exports = mongoose.model('Project', schema, 'projects')
