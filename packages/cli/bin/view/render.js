'use strict'

const spinner = require('ora')({ text: '', color: 'gray' })
const { green, yellow, red, blue, gray } = require('chalk')
const indentString = require('indent-string')
const humanizeUrl = require('humanize-url')
const logSymbols = require('log-symbols')
const prettyMs = require('pretty-ms')
const { EOL } = require('os')

const COLOR = { success: green, warning: yellow, error: red }

const renderProgress = ({ fetchingUrl, count, total, startTimestamp }) => {
  const timestamp = blue(prettyMs(Date.now() - startTimestamp))
  const spinnerFrame = spinner.frame()
  const url = gray(fetchingUrl)
  const progress = total ? gray(`${count} of ${total}`) : ''
  return `${EOL}${timestamp} ${spinnerFrame}${progress} ${url}`
}

const renderResume = state => {
  return Object.keys(state.data).reduce((acc, url) => {
    const allRules = state.data[url]
    let str = `${humanizeUrl(url)}${EOL}`
    Object.keys(allRules).forEach(ruleName => {
      const rules = allRules[ruleName]
      str += indentString(`${ruleName}${EOL}`, 2)
      rules.forEach(rule => {
        const colorize = COLOR[rule.status]
        const info = rule.message ? `${EOL}${indentString(`- ${rule.message}`, 2)}` : ''
        str += colorize(indentString(`${logSymbols[rule.status]} ${rule.selector} ${info}`, 4))
        str += EOL
      })
    })
    return `${acc}${EOL}${str}`
  }, '')
}

module.exports = state => {
  const { quiet, end } = state
  if (quiet) return end ? renderResume(state) : ''
  return end ? renderResume(state) : renderProgress(state)
}

module.exports.resume = renderResume
