var request = require('request')
var config = require('./config.json')
var msg = {
  sdid: config.did,
  type: 'message',
  data: {
    state: 'pressed'
  }
}

function send () {
  request({
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + config.token
    },
    url: 'https://api.artik.cloud/v1.1/messages',
    json: msg
  }, function (error, response, body) {
    if (error) {
      console.error(error)
    } else {
      console.log(body)
    }
  })
}

var Gpio = require('onoff').Gpio
var button = new Gpio(30, 'in', 'both')

button.watch(function (error, value) {
  if (error) {
    console.error(error)
    return
  }

  if (value === 0) {
    console.log('pressed')
    msg.data.state = 'pressed'
    send()
  } else if (value === 1) {
    console.log('released')
    msg.data.state = 'released'
    send()
  }
})
