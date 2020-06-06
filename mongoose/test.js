const assert = require('assert')
const mongoose = require('mongoose')
const config = require('../config/config')
mongoose.connect(config.dbPath, config.dbOptions)

// 连接成功
mongoose.connection.on('connected', () => {
})

const schema = new mongoose.Schema({
  name: {
    type: String,
    default: 0,
    required: '{PATH} is required'
  },
  age: {
    type: Number,
    required: '{PATH} is required'
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v)
      },
      message: '{VALUE} is not a valid phone number!'
    },
    required: [true, 'User phone number required']
  }
})

const Cat = mongoose.model('Cat', schema)

// This cat has no name :(
const cat = new Cat({ phone: 123 })
cat.save().then(data => {
  console.log(data)
}).catch((e) => {
  console.log('savecatch=>', e.toString())
})
Cat.updateOne({ _id: '5ed90938e52a0241c83b05b3' }, { phone: 123 }, { runValidators: true }).then(data => {
  console.log(data)
}).catch((e) => {
  console.log('updateOnecatch=>', e.toString())
})
// const error = cat.validateSync()
// console.log(error)
// if (error) {
//   console.log(error.errors.name.message)
//   console.log(error.errors.age.message)
// } else {
//   cat.save()
// }
