const chalk = require('chalk')

const { yellow, red, green, magenta } = chalk
const { template } = require('chalk')

class Logger {
  // log: (message, ...optionalParams)

  constructor(log) {
    this.log = log
  }

  log(text, params) {
    console.log(text)
    if (params) console.log(params)
  }

  colorful(msg) {
    this.log(template(chalk, msg))
  }

  notice(msg) {
    this.log(magenta(msg))
  }

  warn(msg) {
    this.log(yellow(msg))
  }

  err(msg) {
    this.log(red(msg))
  }

  ok(msg) {
    this.log(green(msg))
  }
}

module.exports = Logger