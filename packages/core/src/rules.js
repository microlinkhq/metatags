'use strict'

const isUrl = require('is-url-http/lightweight')
const reachableUrl = require('reachable-url')

const inRange = (num, init, final) => num >= Math.min(init, final) && num < Math.max(init, final)

// https://moz.com/learn/seo/title-tag
const VALIDATOR = {
  url: async value => {
    if (!isUrl(value)) {
      throw new TypeError(`Expected a valid WHATWG URL, got \`${value}\``)
    }

    const res = await reachableUrl(value)

    if (!reachableUrl.isReachable(res)) {
      throw new TypeError(`Expected a reachable URL, got ${res.statusCode} HTTP status code`)
    }
  },
  generic: value => {
    if (value.toString().length === 0) {
      throw new TypeError('Expected to be present')
    }
  },
  title: value => {
    if (!inRange(value.toString().length, 50, 60)) {
      throw new RangeError(`Expected a value between 50 and 60 maximum length, got ${value.length}`)
    }
  },
  description: value => {
    if (!inRange(value.toString().length, 50, 160)) {
      throw new RangeError(
        `Expected a value between 50 and 160 maximum length, got ${value.length}`
      )
    }
  }
}

module.exports = {
  // Search Engine
  basic: [
    { selector: 'title', validator: VALIDATOR.title },
    { selector: 'link[rel="shortcut icon i"]', attr: 'href', validator: VALIDATOR.generic },
    {
      selector: 'meta[name="description"]',
      attr: 'content',
      validator: VALIDATOR.description
    },
    {
      selector: 'meta[name="author"]',
      attr: 'content',
      validator: VALIDATOR.generic
    },
    { selector: 'link[rel="canonical"]', attr: 'href', validator: VALIDATOR.url },
    { selector: 'meta[name="viewport"]', attr: 'content', validator: VALIDATOR.generic }
  ],
  // Schema.org for Google
  google: [
    { selector: 'meta[itemprop="name"]', attr: 'content', validator: VALIDATOR.generic },
    {
      selector: '[itemprop*="author" i] [itemprop="name"], [itemprop*="author" i]',
      validator: VALIDATOR.generic
    },
    {
      selector: 'meta[itemprop="description"]',
      attr: 'content',
      validator: VALIDATOR.description
    },
    { selector: 'meta[itemprop="image"]', attr: 'content', validator: VALIDATOR.url }
  ],
  twitter: [
    { selector: 'meta[name="twitter:card"]', attr: 'content', validator: VALIDATOR.generic },
    { selector: 'meta[name="twitter:title"]', attr: 'content', validator: VALIDATOR.title },
    {
      selector: 'meta[name="twitter:description"]',
      attr: 'content',
      validator: VALIDATOR.description
    },
    { selector: 'meta[name="twitter:image"]', attr: 'content', validator: VALIDATOR.url },
    { selector: 'meta[name="twitter:image:alt"]', attr: 'content', validator: VALIDATOR.generic },
    { selector: 'meta[name="twitter:site"]', attr: 'content', validator: VALIDATOR.generic },
    { selector: 'meta[name="twitter:creator"]', attr: 'content', validator: VALIDATOR.generic }
  ],
  // Open Graph general (Facebook, Pinterest & Google+)
  facebook: [
    { selector: 'meta[property="og:title"]', attr: 'content', validator: VALIDATOR.title },
    {
      selector: 'meta[property="og:description"]',
      attr: 'content',
      validator: VALIDATOR.generic
    },
    { selector: 'meta[property="og:image"]', attr: 'content', validator: VALIDATOR.url },
    { selector: 'meta[property="og:image:alt"]', attr: 'content', validator: VALIDATOR.generic },
    { selector: 'meta[property="og:logo"]', attr: 'content', validator: VALIDATOR.url },
    { selector: 'meta[property="og:url"]', attr: 'content', validator: VALIDATOR.url },
    { selector: 'meta[property="og:type"]', attr: 'content', validator: VALIDATOR.generic },
    { selector: 'meta[property="og:site_name"]', attr: 'content', validator: VALIDATOR.generic }
  ]
}
