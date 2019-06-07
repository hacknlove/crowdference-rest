const test = require('ava')
const MongoClient = require('mongodb').MongoClient

const expressG = require('../src/express')
const validations = require('../src/validations')
const crawler = require('../src/crawler')

test.beforeEach(async function (t) {
  const f = {}
  t.context.server = new Proxy(f, {
    get (obj, prop) {
      if (obj[prop] !== undefined) {
        return obj[prop]
      }
      if (prop === '__esModule') { // some babel related thing
        return false
      }
      throw new Error(`it should not be calling server.${prop} now`)
    }
  })
  expressG(t.context.server)

  t.context.BASE = Math.random().toString(32).substr(2)
  const client = await MongoClient.connect('mongodb://127.0.0.1:27018', {
    useNewUrlParser: true
  })
  t.context.server.db = client.db(t.context.BASE)
  t.context.server.urls = t.context.server.db.collection('urls')
  t.context.BASE = Math.random().toString(32).substr(2) // base de datos aleatoria

  validations(t.context.server)
  crawler(t.context.server)
})

test.afterEach.always(async function (t) {
  await t.context.server.db.dropDatabase()
})

test('pass', function (t) {
  t.pass()
})
