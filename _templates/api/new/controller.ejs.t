---
to: app/api/<%= name %>/controller.js
---

// const { services: {
//   documentService
// } } = require('../../../app')

/**
 * @method health
 *
 * Health Check
 *
 */
exports.health = async (req, res) => {
  const data = {
    message: 'All Ok!'
  }

  res.status(200).json(data)
}

/**
 * @method healthPost
 *
 * Health Post Check
 *
 */
exports.healthPost = async (req, res) => {
  const { body } = req

  const data = {
    message: 'All Ok!',
    body
  }

  res.status(200).json(data)
}

/**
 * @method health
 *
 * Health Check
 *
 */
exports.healthSlow = async (req, res) => {
  const data = {
    message: 'All Slow!'
  }

  setTimeout(function () {
    res.status(200).json(data)
  }, 2500)
}

/**
 * @method healthError
 *
 * Health Error Check
 *
 */
exports.healthError = async () => {
  throw new Error('Problem here.')
}