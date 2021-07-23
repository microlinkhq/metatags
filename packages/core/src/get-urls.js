'use strict'

const fromXML = require('xml-urls')
const aigle = require('aigle')

const { isXmlUrl } = fromXML

module.exports = async (urls, opts) => {
  const collection = [...new Set([].concat(urls))]

  const iterator = async (set, url) => {
    const urls = isXmlUrl(url) ? await fromXML(url, opts) : [url]
    return new Set([...set, ...urls])
  }

  const set = await aigle.reduce(collection, iterator, new Set())
  const result = Array.from(set)
  return result
}
