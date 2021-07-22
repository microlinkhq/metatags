'use strict'

const { green, gray } = require('chalk')
const { name, description } = require('../../../../package.json')

module.exports = gray(`${gray(description)}.

  Usage
    $ ${green(name)} <url> [<flags>]

  Flags
    -c, --concurrence     Number of concurrent petitions (defaults to 8).
    -f, --followRedirect  Redirect responses should be followed (defaults to true).
    -h, --help            Show the help information.
    -r, --retries         Number of request retries when network errors happens (defaults to 2).
    -t, --timeout         Milliseconds to wait before consider a timeout response.
    -p, --prerender       Enable or disable prerendering for getting HTML markup (defaults to auto).
`)
