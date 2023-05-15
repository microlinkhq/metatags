'use strict'

const spinner = require('ora')({ text: '', color: 'gray' })
const indentString = require('indent-string')
const cliTruncate = require('cli-truncate')
const terminalSize = require('term-size')
const logSymbols = require('log-symbols')
const prettyMs = require('pretty-ms')

const { STATUS_CODE } = require('http')
const { EOL } = require('os')

const color = require('../color')
const { pink, gray } = color

const { columns } = terminalSize()

const truncateText = text => (text.length + 50 < columns ? text : cliTruncate(text, columns - 50))

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
    const humanStatusCode = gray(`${statusCode} ${STATUS_CODE[statusCode]}`)
    let str = `${url} ${humanStatusCode} ${EOL}`
    Object.keys(allRules).forEach(ruleName => {
      const rules = allRules[ruleName]
      str += `${EOL}${indentString(`${ruleName}`, 2)}${EOL}`

      rules.forEach(rule => {
        const colorize = color[rule.status]
        const value = truncateText(rule.value)
        const info = rule.message ? `${EOL}${indentString(`- ${rule.message}`, 2)}` : ''
        str += indentString(
          `${colorize(logSymbols[rule.status])} ${colorize(rule.selector)} ${gray(
            `(${rule.value.length})`
          )} ${gray(value)} ${colorize(info)}`,
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
