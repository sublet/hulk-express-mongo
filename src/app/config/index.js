const fs = require('fs')
const _ = require('lodash')
const path = require('path')

module.exports = (appPath) => {

  let config = {
    aws: {
      key: process.env.AWS_KEY,
      secret: process.env.AWS_SEC
    },
    express: {
      port: 5000
    },
    logger: {
      file: {
        level: 'info',
        filename: `/tmp/app.log`,
        handleExceptions: true,
        exitOnError: false,
        json: true,
        maxsize: 5242880, // 5MB file chunks
        maxFiles: 5
      },
      output: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        align: true,
        exitOnError: false,
        colorize: true,
        levels: {
          critical: 0,
          error: 1,
          warn: 2,
          info: 3,
          debug: 4
        },
        colors: {
          critical: 'red bold',
          error: 'red italic',
          warn: 'yellow bold',
          info: 'green',
          debug: 'blue'
        }
      }
    },
    mongo: {
      uri: process.env.MONGO_URI,
      db: process.env.MONGO_DB,
      ssl: (process.env.SSL === 'true') || false,
      pool: 1
    }
  }
  
  const env = process.env.NODE_ENV || 'local'
  const configPath = path.resolve(__dirname, `${appPath}/config/${env}.js`)
  const defaultConfig = require(path.resolve(__dirname, `${appPath}/config/default.js`))
  
  config = _.extend(config, defaultConfig)
  
  if (fs.existsSync(configPath)) {
    const envConfig = require(configPath)
    config = _.extend(config, envConfig)
  } else {
    /* eslint-disable no-console */
    console.log(`Config file not found at ${configPath}.`)
    /* eslint-enable no-console */
  }

  return config

}