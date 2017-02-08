if (process.argv.length !== 3 ||
  (process.argv[2] !== 'on' && process.argv[2] !== 'off')) {
  console.error('Usage: node 02_gpio.js {on/off}')
  process.exit(1)
}

var Gpio = require('onoff').Gpio
var light = new Gpio(28, 'out')

if (process.argv[2] === 'on') {
  light.writeSync(1)
} else if (process.argv[2] === 'off') {
  light.writeSync(0)
}

