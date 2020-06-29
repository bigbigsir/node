const assert = require('assert')
const mongoose = require('./connect')

const schema = new mongoose.Schema({
  name: {
    type: String,
    default: 'cat',
    required: '{PATH} is required'
  },
  age: {
    type: Number,
    default: 10,
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
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cat',
    default: null
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cat'
  }]
}, { versionKey: false })

const BandSchema = new mongoose.Schema({
  name: String
}, {
  versionKey: false,
  toObject: {
    virtuals: true
  },
  toJSON: { virtuals: true }
})

BandSchema.virtual('members', {
  ref: 'Cat', // The model to use
  localField: 'name', // Find people where `localField`
  foreignField: 'phone', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false
})

// schema.pre('save', function (next) {
//   console.log('pre save\n', this)
//   next(new Error('something went wrong'))
// })

// schema.pre('find', function (next) {
//   console.log('pre find\n')
//   this.populate('children')
//   next()
// })

const Cat = mongoose.model('Cat', schema)

const Band = mongoose.model('Band', BandSchema)

const cat = new Cat({
  name: 'cat' + Date.now(),
  phone: '123-123-1235',
  parent: '5ee487a79b0cbb305c230a52',
  user: '5ed7710a9ba1e536421911e6'
})

const band = new Band({
  name: '123-123-1235'
})

// band.save().then(data => {
//   console.log(data)
// }).catch((e) => {
//   console.log('savecatch=>', e.toString())
// })

// cat.save().then(data => {
//   console.log(data)
// }).catch((e) => {
//   console.log('savecatch=>', e.toString())
// })

// Cat.updateOne({ _id: '5ee487a79b0cbb305c230a52' }, { children: ['5ee488c5913191307e76164a'] }, { runValidators: true }).then(data => {
//   console.log(data)
// }).catch((e) => {
//   console.log('updateOnecatch=>', e.toString())
// })

// Cat.find({ parent: null }).populate('user', 'username -_id').populate('children', 'name children').exec(function (err, story) {
//   if (err) return console.log(err)
//   console.log(JSON.stringify(story))
// })

// Band.findOne({}).populate({
//   path: 'members',
//   match: { name: { $ne: 'cat' } },
//   options: { limit: 5 },
//   select: {
//     _id: 0,
//     name: 1,
//     phone: 1
//   }// 'name phone -_id'
// }).exec(function (err, story) {
//   if (err) return console.log(err)
//   console.log(story)
// })

// const error = cat.validateSync()
// console.log(error)
// if (error) {
//   console.log(error.errors.name.message)
//   console.log(error.errors.age.message)
// } else {
//   cat.save()
// }
