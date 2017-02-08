var request = require('request')
var config = require('./config.json')
var Gpio = require('onoff').Gpio
var button = new Gpio(30, 'in', 'both')

function send (msg) {
  request({
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + config.token
    },
    url: 'https://api.artik.cloud/v1.1/messages',
    json: {
      sdid: config.did,
      type: 'message',
      ts: Date.now(),
      data: msg
    }
  }, function (error, response, body) {
    if (error) {
      console.error(error)
    } else {
      console.log(body)
    }
  })
}

button.watch(function (error, value) {
  if (error) {
    console.error(error)
    return
  }

  if (value === 0) {
    console.log('pressed')
    send({ state: 'pressed' })
  } else if (value === 1) {
    console.log('released')
    send({ state: 'released' })
  }
})
