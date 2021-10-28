---
to: app/sls/cron.js
---
process.env.PROGRAM_NAME = 'cron'

require('../../paths')

const app = require('../../app')
app.getServer()

const logger = app.logger

/**
 * doSomeProcess
 * Do Some Process
 * 
 * Runs Every 2 Minutes
 * 
 * @param event (the event)
 * @param context (the context)
*/

exports.doSomeProcess = async (event, context) => {
  let data = { hello: 'world' }

  return {}
}