'use strict'
const bodyParser = require('body-parser')

module.exports = function (server, port, ip) {
  server.app = require('express')()
  server.app.enable('trust proxy')
  server.app.use(require('compression')())
  // server.app.use(require('cors')())
  server.app.use(bodyParser.json())
  server.app.use(bodyParser.raw())
  server.app.use(bodyParser.text())
  server.app.use(bodyParser.text())

}
