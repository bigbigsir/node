const mongoose = require('./connect')

const schemaType = {
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
  sort: {
    type: Number,
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
}
const schemaOptions = {
  versionKey: false,
  toJSON: { virtuals: true },
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
}

const schema = new mongoose.Schema(schemaType, schemaOptions)

module.exports = mongoose.model('Project', schema, 'projects')
