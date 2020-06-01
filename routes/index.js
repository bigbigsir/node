const express = require('express')
const router = express.Router()
const User = require('../mongoose/user')
const jwt = require('../util/token')
const {
  md5Sign,
  getClientIp,
  reverseString,
  privateDecrypt
} = require('../util/util')

router.use((req, res, next) => {
  const qid = req.get('qid')
  const sign = req.get('sign')
  const token = req.get('token')
  const _sign = qid + reverseString(JSON.stringify(req.body)) + token

  if (md5Sign(_sign) !== sign) {
    res.sendStatus(403)
  } else {
    next()
  }
})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.post('/test', (req, res, next) => {
  const { body } = req
  const user = new User({
    username: 'admin' + Date.now(),
    password: '123456',
    age: 'assd20'
  })
  user.save().then(e => {
    console.log('then=>', e)
    return e
  }).catch(e => {
    console.log('catch=>', e)
    return e
  }).then(result => {
    res.send(result)
  })
})

module.exports = router
