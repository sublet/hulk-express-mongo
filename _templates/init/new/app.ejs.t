---
to: app.js
---
const path = require('path')

const config = {
  port: process.env.EXPRESS_PORT || '3000',
  bind: '127.0.0.1',
  appFolder: path.join(__dirname, 'app'),
  wrapAsync: (fn, validate = false) => {
    return function(req, res, next) {

      if (validate) fn(req, res, next).catch(next)

      // Make sure to `.catch()` any errors and pass them along to the `next()`
      // middleware in the chain, in this case the error handler.
      if (!validate) fn(req, res, next).catch(next)
    }
  },
  dataLayer: null
}

const databaseConfig = {
  servicesPath: path.join(__dirname, 'app/services'),
  mongo: {
    uri: process.env.MONGO_URI,
    db: process.env.MONGO_DB,
    ssl: process.env.SSL === 'true',
    poolSize: 1
  }
}

config.dataLayer = require('@sublet/hulk-dl-mongo')(databaseConfig)

const server = require('@sublet/hulk-express-server')(config)

server.setupAndCreate()

module.exports = server