'use strict'

const VALIDATOR = require('./validators')

module.exports = {
  // Search Engine
  basic: [
    { selector: 'title', validator: VALIDATOR.title },
    {
      selector: 'link[rel="icon" i], link[rel="shortcut icon" i]',
      attr: 'href',
      validator: VALIDATOR.presence
    },
    {
      selector: 'meta[name="description"]',
      attr: 'content',
      validator: VALIDATOR.description
    },
    {
      selector: 'meta[charset]',
      attr: 'charset',
      validator: VALIDATOR.presence
    },
    {
      selector: 'meta[name="author"]',
      attr: 'content',
      validator: VALIDATOR.notEmpty
    },
    { selector: 'link[rel="canonical"]', attr: 'href', validator: VALIDATOR.url },
    { selector: 'meta[name="viewport"]', attr: 'content', validator: VALIDATOR.notEmpty }
  ],
  // Schema.org for Google
  google: [
    { selector: 'meta[itemprop="name"]', attr: 'content', validator: VALIDATOR.title },
    {
      selector: '[itemprop*="author" i] [itemprop="name"], [itemprop*="author" i]',
      validator: VALIDATOR.notEmpty
    },
    {
      selector: 'meta[itemprop="description"]',
      attr: 'content',
      validator: VALIDATOR.description
    },
    { selector: 'meta[itemprop="image"]', attr: 'content', validator: VALIDATOR.url }
  ],
  twitter: [
    { selector: 'meta[name="twitter:card"]', attr: 'content', validator: VALIDATOR.notEmpty },
    { selector: 'meta[name="twitter:title"]', attr: 'content', validator: VALIDATOR.title },
    {
      selector: 'meta[name="twitter:description"]',
      attr: 'content',
      validator: VALIDATOR.description
    },
    { selector: 'meta[name="twitter:image"]', attr: 'content', validator: VALIDATOR.url },
    { selector: 'meta[name="twitter:image:alt"]', attr: 'content', validator: VALIDATOR.notEmpty },
    { selector: 'meta[name="twitter:site"]', attr: 'content', validator: VALIDATOR.notEmpty },
    { selector: 'meta[name="twitter:creator"]', attr: 'content', validator: VALIDATOR.notEmpty }
  ],
  // Open Graph general (Facebook, Pinterest & Google+)
  facebook: [
    { selector: 'meta[property="og:title"]', attr: 'content', validator: VALIDATOR.title },
    {
      selector: 'meta[property="og:description"]',
      attr: 'content',
      validator: VALIDATOR.notEmpty
    },
    { selector: 'meta[property="og:image"]', attr: 'content', validator: VALIDATOR.url },
    { selector: 'meta[property="og:image:alt"]', attr: 'content', validator: VALIDATOR.notEmpty },
    { selector: 'meta[property="og:logo"]', attr: 'content', validator: VALIDATOR.url },
    { selector: 'meta[property="og:url"]', attr: 'content', validator: VALIDATOR.url },
    { selector: 'meta[property="og:type"]', attr: 'content', validator: VALIDATOR.notEmpty },
    { selector: 'meta[property="og:site_name"]', attr: 'content', validator: VALIDATOR.notEmpty }
  ]
}
