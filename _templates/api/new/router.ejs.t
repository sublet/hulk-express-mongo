---
to: app/api/<%= name %>/router.js
---
const { router } = require('../../../app')
const controller = require('./controller')

router.get(
  '/health',
  router.wrapAsync(async (req, res) => await controller.health(req, res))
)

router.post(
  '/health',
  router.wrapAsync(async (req, res) => await controller.healthPost(req, res))
)

router.get(
  '/health/slow',
  router.wrapAsync(async (req, res) => await controller.healthSlow(req, res))
)

router.get(
  '/health/error',
  router.wrapAsync(async (req, res) => await controller.healthError(req, res))
)
