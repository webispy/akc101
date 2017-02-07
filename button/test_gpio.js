var Gpio = require('onoff').Gpio
var button = new Gpio(30, 'in', 'both')

button.watch(function (error, value) {
  if (error) {
    console.error(error)
    return
  }

  if (value === 0) {
    console.log('pressed')
  } else if (value === 1) {
    console.log('released')
  }
})
