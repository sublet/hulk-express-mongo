const _ = require('lodash')
const fs = require('fs')

class Services {
  get Model() {
    return require('./model')
  }
  
  get Service() {
    return require('./service')
  }

  build(appPath) {
    fs.readdirSync(`${appPath}/services/`).forEach(file => {
      require(`${appPath}/services/${file}`)
    })
  }
}

module.exports = new Services()