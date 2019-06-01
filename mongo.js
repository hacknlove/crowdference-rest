'use strict'
module.exports = async function (server) {
  const MongoClient = require('mongodb').MongoClient

  return MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true
  }).then(function (client) {
    server.db = client.db(process.env.BASE)
    server.urls = server.db.collection('urls')
  })
}
