const api = require('./api')
const config = require('./config')
const logger = require('./logger')
const server = require('./server')
const service = require('./service')

class Server {

  get api() {
    return api
  }

  get config() {
    return config
  }

  get logger() {
    return logger
  }

  get server() {
    return server
  }

  get service() {
    return service
  }

}

module.exports = new Server()