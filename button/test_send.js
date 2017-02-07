var request = require('request')
var config = require('./config.json')
var msg = {
  sdid: config.did,
  type: 'message',
  data: {
    state: 'pressed'
  }
}

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

