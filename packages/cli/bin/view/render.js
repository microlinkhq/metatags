'use strict'

const spinner = require('ora')({ text: '', color: 'gray' })
const indentString = require('indent-string')
const humanizeUrl = require('humanize-url')
const httpStatus = require('http-status')
const logSymbols = require('log-symbols')
const prettyMs = require('pretty-ms')
const { EOL } = require('os')

const color = require('../color')
const { pink, gray } = color

const renderProgress = ({ fetchingUrl, count, total, startTimestamp }) => {
  const timestamp = pink(prettyMs(Date.now() - startTimestamp))
  const spinnerFrame = spinner.frame()
  const url = gray(fetchingUrl)
  const progress = total ? gray(`${count} of ${total}`) : ''
  return `${EOL}${timestamp} ${spinnerFrame}${progress} ${url}${EOL}`
}

const renderResume = state => {
  return Object.keys(state.data).reduce((acc, url) => {
    const allRules = state.data[url]
    const statusCode = state.status[url]
    const humanStatusCode = gray(`${statusCode} ${httpStatus[statusCode]}`)
    let str = `${humanizeUrl(url)} ${humanStatusCode} ${EOL}`
    Object.keys(allRules).forEach(ruleName => {
      const rules = allRules[ruleName]
      str += `${EOL}${indentString(`${ruleName}`, 2)}${EOL}${EOL}`
      rules.forEach(rule => {
        const colorize = color[rule.status]
        const info = rule.message ? `${EOL}${indentString(`- ${rule.message}`, 2)}${EOL}` : EOL
        str += indentString(
          `${colorize(logSymbols[rule.status])} ${colorize(rule.selector)} ${gray(
            rule.value
          )} ${colorize(info)}`,
          4
        )
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
