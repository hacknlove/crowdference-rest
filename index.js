(async function (server) {
  require('./express')(server)
  require('./crawler')(server)
  require('./validations')(server)
  await require('./mongo')(server)

  require('./endpoints/url')(server)
  server.server = require('http').createServer(server.app)
  server.server.listen(8000, '0.0.0.0')
  console.log('listen', new Date())
})(require(process.env.settings || './server'))
