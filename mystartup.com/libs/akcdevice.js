'use strict'

const rp = require('request-promise')

const api = function (method, path, token, jsonbody = undefined) {
  return rp({
    method: method,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    json: jsonbody,
    url: 'https://api.artik.cloud/v1.1' + path
  })
}

module.exports.getLastMessage = function (did, token) {
  return api('GET', '/messages/last?count=1&sdids=' + did, token)
}

module.exports.getUserDevices = function (uid, token) {
  return api('GET', '/users/' + uid + '/devices', token)
}

module.exports.sendAction = function (did, action, token) {
  console.log(did, action, token)
  return api('POST', '/messages', token, {
    'ddid': did,
    'type': 'action',
    'data': {
      'actions': [
        {
          'name': action,
          'parameters': {}
        }
      ]
    }
  })
}
