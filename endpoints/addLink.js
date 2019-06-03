'use strict'

module.exports = function (server) {
  const validate = function validate (req, res, next) {
    server.validate({
      data: req.body,
      schema: server.validations.addLink
    }, res, next)
  }
  const getFrom = async function getFrom (req, res, next) {
    try {
      req.fromUrl = await server.getUrl(req.body.fromUrl)
    } catch (e) {
      return server.end(500, e, res)
    }
    next()
  }
  const getTo = async function getTo (req, res, next) {
    try {
      req.toUrl = await server.getUrl(req.body.toUrl)
    } catch (e) {
      return server.end(500, e, res)
    }
    next()
  }
  const addLink = async function addLink (req, res, next) {
    if (req.fromUrl.votesTo[req.toUrl._id]) {
      return next()
    }
    server.urls.updateOne({
      _id: req.fromUrl._id
    }, {
      $set: {
        lastActivity: new Date(),
        [`votesTo.${req.toUrl._id}`]: 0
      },
      $push: {
        toUrlId: req.toUrl._id
      },
      $addToSet: {
        ids: req.toUrl._id
      },
      $inc: {
        totalLinks: 1
      }
    })
    server.urls.updateOne({
      _id: req.toUrl._id
    }, {
      $set: {
        lastActivity: new Date(),
        [`votesFrom.${req.fromUrl._id}`]: 0
      },
      $push: {
        fromUrlId: req.fromUrl._id
      },
      $addToSet: {
        ids: req.fromUrl._id
      },
      $inc: {
        totalBackLinks: 1
      }
    })
    next()
  }
  const response = async function response (req, res, next) {
    res.status(200).json({ok: true}).end()
  }
  server.app.post('/addLink', validate)
  server.app.post('/addLink', getFrom)
  server.app.post('/addLink', getTo)
  server.app.post('/addLink', addLink)
  server.app.post('/addLink', response)
}
