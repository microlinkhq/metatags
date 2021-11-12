'use strict'

const reachableUrl = require('reachable-url')
const isUrl = require('is-url-http')
const whoops = require('whoops')

const inRange = (num, init, final) => num >= Math.min(init, final) && num < Math.max(init, final)

const ruleError = whoops('RuleError', { status: 'error' })
ruleError.warning = props => ruleError({ ...props, status: 'warning' })

const VALIDATOR = {
  url: async ({ value }) => {
    if (value.toString().length === 0) {
      throw ruleError({ message: 'Expected to be present' })
    }

    if (!isUrl(value)) {
      throw ruleError({ message: `Expected an absolute WHATWG URL, got \`${value}\`` })
    }

    const res = await reachableUrl(value)

    if (!reachableUrl.isReachable(res)) {
      throw ruleError({
        message: `Expected a reachable URL, got ${res.statusCode} HTTP status code`
      })
    }
  },
  /* when is present, it can't be empty */
  notEmpty: ({ el, value }) => {
    if (el.length !== 0 && value.toString().length === 0) {
      throw ruleError.warning({
        message: 'Expected to be not empty'
      })
    }
  },
  /** it should be exist and no be empty */
  presence: ({ el, value }) => {
    if (el.length === 0) {
      throw ruleError({ message: 'Expected to be present' })
    }
    if (value.toString().length === 0) {
      throw ruleError.warning({
        message: 'Expected to be not empty'
      })
    }
  },
  title: ({ el, value }) => {
    if (el.length === 0) {
      throw ruleError({
        message: 'Expected to be present',
        link: 'https://moz.com/learn/seo/title-tag'
      })
    }

    if (!inRange(value.toString().length, 50, 60)) {
      throw ruleError.warning({
        message: 'Recommended a value between 50 and 60 characters',
        link: 'https://moz.com/learn/seo/title-tag'
      })
    }
  },
  description: ({ value }) => {
    if (value.toString().length === 0) {
      throw ruleError({ message: 'Expected to be present' })
    }

    if (!inRange(value.toString().length, 50, 160)) {
      throw ruleError.warning({
        message: 'Recommended a value between 50 and 160 characters',
        link: 'https://moz.com/learn/seo/meta-description'
      })
    }
  }
}

module.exports = VALIDATOR
