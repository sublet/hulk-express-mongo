const winston = require('winston')
const { PapertrailConnection, PapertrailTransport } = require('winston-3-papertrail')
const config = require('./config')

const hostname = process.env.PAPERTRAIL_HOSTNAME || 'hulk-express-server'
const program = process.env.PAPERTRAIL_PROGRAM || 'default'

winston.addColors(config.output.colors)

const consoleLogger = new winston.transports.Console(config.output)

let transports = []

if (process.env.PAPERTRAIL_URI && process.env.PAPERTRAIL_PORT) {
  if (['test'].indexOf(process.env.NODE_ENV) < 0) {

    const params = {
      host: process.env.PAPERTRAIL_URI,
      port: Number(process.env.PAPERTRAIL_PORT)
    }

    const connectionParams = {
      hostname: hostname,
      program: program,
      colorize: true
    }
  
    const ptTransport = new PapertrailTransport(new PapertrailConnection(params), connectionParams)

    ptTransport.on('error', function(err) {
      console.log('ERROR: ', err)
    })
    
    transports.push(ptTransport)
  }
}

transports.push(consoleLogger)

module.exports = transports