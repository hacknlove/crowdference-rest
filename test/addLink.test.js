import test from 'ava'
const request = require('supertest')

require('./test.common.js')

test('POST /addLink create link', async function (t) {
  const server = t.context.server
  require('../src/endpoints/addLink')(server)

  const res = await request(server.app)
    .post('/addLink')
    .type('application/json')
    .send({
      fromUrl: 'pykiss.com',
      toUrl: 'letrios.com'
    })

  const from = await server.urls.findOne({
    url: 'pykiss.com'
  })
  const to = await server.urls.findOne({
    url: 'letrios.com'
  })

  t.is(res.status, 200)
  t.deepEqual(res.body, {
    ok: true
  })

  t.is(from.toUrlId[0], to._id)
  t.is(from.votesTo[to._id], 0)
  t.deepEqual(from.ids, [from._id, to._id])

  t.is(to.fromUrlId[0], from._id)
  t.is(to.votesFrom[from._id], 0)
  t.deepEqual(to.ids, [to._id, from._id])
})
