const express = require('express')
const socket = require('socket.io')
const jwt = require('./util/token')
const { updateForAdmin } = require('./routes/web_hooks/actions.js')

const app = express()
const port = process.env.PORT || 3000
const server = app.listen(port, '0.0.0.0', () => {
  console.log('Listening on socket port: ' + port)
})
const io = socket(server, {
  handlePreflightRequest (req, res) {
    const headers = {
      'Access-Control-Allow-Headers': 'token,appId',
      // or the specific Origin you want to give access to
      'Access-Control-Allow-Origin': req.headers.origin,
      'Access-Control-Allow-Credentials': true
    }
    res.writeHead(200, headers)
    res.end()
  }
})
const nsp = io.of('/socket/webHooks')

nsp.use((socket, next) => {
  const { token, appid } = socket.request.headers
  const payload = jwt.verifyToken(token) || {}
  if (payload.appId === appid) {
    next()
  } else {
    next(new Error('权限验证失败'))
  }
}).on('connection', (socket) => {
  socket.on('updateProject', params => {
    updateForAdmin(params.id, socket)
  })
})
