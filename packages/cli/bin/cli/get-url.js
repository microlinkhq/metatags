'use strict'

const prependHttp = require('prepend-http')

module.exports = input => {
  const value = input || process.env.DEPLOY_URL || process.env.DEPLOY_PRIME_URL || process.env.URL
  const collection = Array.isArray(value) ? value : value.split(',').map(item => item.trim())
  return collection.map(prependHttp)
}
