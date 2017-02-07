var config = require('./config.json')
var Gpio = require('onoff').Gpio
var light = new Gpio(28, 'out')
var WSClient = require('websocket').client
var ws = new WSClient()

function send (conn, msg) {
  conn.sendUTF(JSON.stringify({
    sdid: config.did,
    type: 'message',
    data: msg
  }))
}

ws.on('connect', function (conn) {
  conn.on('message', function (msg) {
    var jsondata = JSON.parse(msg.utf8Data)
    if (jsondata.type !== 'action') {
      return
    }

    jsondata.data.actions.forEach(function (action) {
      console.log(action)
      if (action.name === 'setOn') {
        light.writeSync(1)
        send(conn, { state: 'on' })
      } else if (action.name === 'setOff') {
        light.writeSync(0)
        send(conn, { state: 'off' })
      }
    })
  })

  conn.sendUTF(JSON.stringify({
    sdid: config.did,
    Authorization: 'bearer ' + config.token,
    type: 'register'
  }), function () {
    console.log('registered')
  }
  )
})

ws.connect('wss://api.artik.cloud/v1.1/websocket?ack=true')
