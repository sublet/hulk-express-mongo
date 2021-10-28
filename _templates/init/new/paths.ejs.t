---
to: paths.js
---
const modulePaths = require('app-module-path')

modulePaths.addPath(__dirname)
modulePaths.addPath(`${__dirname}/src/`)