(async function (server) {
  require('./src/express')(server)
  require('./src/crawler')(server)
  require('./src/validations')(server)
  await require('./src/mongo')(server)

  require('./src/endpoints/url')(server)
  require('./src/endpoints/addLink')(server)

  server.server = require('http').createServer(server.app)
  server.server.listen(8000, '0.0.0.0')
  console.log('listen', new Date())
})(require(process.env.settings || './server'))
