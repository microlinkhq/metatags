'use strict'

const { isNil } = require('lodash')
const neatLog = require('neat-log')

const build = require('../cli/build')
const render = require('./render')

module.exports = ({ total, emitter, logspeed, ...opts }) => {
  const state = {
    count: 0,
    end: false,
    fetchingUrl: '',
    startTimestamp: Date.now(),
    exitCode: null
  }

  const neat = neatLog(render, { ...opts, logspeed, state })

  let hasErrors = false

  neat.use((state, bus) => {
    emitter.on('urls', urls => (state.total = urls.length))

    emitter.on('fetching', data => {
      state.fetchingUrl = data.url
      ++state.count
    })

    emitter.on('rule', ({ status }) => {
      if (!hasErrors && status === 'error') {
        hasErrors = true
      }
    })

    emitter.on('end', data => {
      state.data = data
      state.end = true
      state.exitCode = Number(hasErrors)
    })

    setInterval(async () => {
      bus.emit('render')
      if (!isNil(state.exitCode)) {
        await build.exit({ buildCode: state.exitCode })
      }
    }, logspeed)
  })
}
