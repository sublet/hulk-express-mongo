---
to: app/sls/index.js
---
require('../../paths')

const serverless = require('serverless-http')
const app = require('../../app')
const server = app.getServer()

/*
 * Notes:
 * callbackWaitsForEmptyEventLoop: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 */

const options = { 
  callbackWaitsForEmptyEventLoop: false 
}

exports.proxy = serverless(server, options)
