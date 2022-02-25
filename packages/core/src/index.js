'use strict'

// const timeSpan = require('time-span')

const getHTML = require('html-get')
const cheerio = require('cheerio')
const aigle = require('aigle')
const mitt = require('mitt')

const _getBrowserless = require('./get-browserless')
const getUrls = require('./get-urls')
const allRules = require('./rules')

const evaluateRule = async ({ value, validator, el }) => {
  let status = 'success'
  let message

  try {
    await validator({ value, el })
  } catch (error) {
    status = error.status
    message = error.message
  }

  return { status, message }
}

const validate = async (html, emitter) => {
  const $ = cheerio.load(html)

  return aigle.reduce(
    allRules,
    async (acc, rules, rulesName) => {
      const evaluatedRules = await aigle.map(rules, async rule => {
        const { selector, attr } = rule
        const el = $(`head ${selector}`)
        const value = (attr ? el.attr(attr) : el.text()) || ''

        const result = await evaluateRule({ ...rule, value, el })
        const evaluatedRule = { ...rule, ...result, value }

        emitter.emit('rule', evaluatedRule)
        return evaluatedRule
      })

      acc[rulesName] = evaluatedRules
      return acc
    },
    {}
  )
}

const validateUrl = async ({ acc, url, emitter, ...opts }) => {
  emitter.emit('fetching', { url })
  const data = await getHTML(url, opts)
  emitter.emit('fetched', { ...data, targetUrl: url })

  const report = await validate(data.html, emitter)
  emitter.emit('report', report)

  acc[url] = report
}

const resolveUrls = async (urls, { emitter, concurrence, ...opts } = {}) =>
  aigle.transformLimit(
    urls,
    concurrence,
    (acc, url) => validateUrl({ acc, url, emitter, ...opts }),
    {}
  )

module.exports = (
  urls,
  { emitter = mitt(), concurrence = 8, getBrowserless = _getBrowserless, ...opts } = {}
) => {
  getUrls(urls, { getBrowserless, ...opts })
    .then(urls => {
      emitter.emit('urls', urls)
      return resolveUrls(urls, { emitter, concurrence, getBrowserless, ...opts })
    })
    .then(data => emitter.emit('end', data))
    .catch(error => emitter.emit('error', error))

  return emitter
}
