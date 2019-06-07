import test from 'ava'
const request = require('supertest')

const endpoint = require('../src/endpoints/url')
require('./test.common.js')

test('GET /url/foo.bar/baz/no/existe', async function (t) {
  const server = t.context.server
  endpoint(server)

  const res = await request(server.app)
    .get('/url/foo.bar/baz')

  t.is(res.status, 200)
  t.is(res.body, false)
})

test('GET /url/foo.bar/baz/si/existe', async function (t) {
  const server = t.context.server
  endpoint(server)

  await server.urls.insertMany([
    {
      _id: 'test',
      url: ['foo.bar/baz/si/existe']
    },
    {
      _id: '1',
      fromUrlId: ['test'],
      url: ['uno']
    },
    {
      _id: '2',
      fromUrlId: ['test'],
      url: ['dos']
    },
    {
      _id: '3',
      toUrlId: ['test'],
      url: ['tres']
    },
    {
      _id: '4',
      toUrlId: ['test'],
      url: ['cuatro']
    }
  ])

  const res = await request(server.app)
    .get('/url/foo.bar/baz/si/existe')

  t.is(res.status, 200)
  t.deepEqual(res.body, {
    _id: 'test',
    fromUrl: [{
      _id: '3',
      url: ['tres']
    }, {
      _id: '4',
      url: ['cuatro']
    }],
    toUrl: [{
      _id: '1',
      url: ['uno']
    }, {
      _id: '2',
      url: ['dos']
    }]
  })
})
