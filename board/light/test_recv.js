var config = require('./config.json')
var WSClient = require('websocket').client
var ws = new WSClient()

var registerMsg = {
  sdid: config.did,
  Authorization: 'bearer ' + config.token,
  type: 'register'
}

ws.on('connect', function (conn) {
  conn.on('message', function (msg) {
    console.log(msg.utf8Data)
  })

  conn.sendUTF(JSON.stringify(registerMsg), function () {
    console.log('registered')
  })
})

ws.connect('wss://api.artik.cloud/v1.1/websocket?ack=true')

