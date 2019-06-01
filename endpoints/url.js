'use strict'

module.exports = function (server) {
  const getUrlValidation = function getUrlValidation (req, res, next) {
    server.validate({
      data: req.params.url,
      schema: server.validations.testUrl
    }, res, next)
  }
  const getUrl = async function getUrl (req, res, next) {
    const url = await server.urls.findOne({
      url: req.params.url
    }, {
      projection: {
        bookmarks: 1
      }
    })
    if (url) {
      console.log(url)
      req.currentUrl = url
      return next()
    }
    return res.status(200).json(false).end()
  }
  const getUrlTo = async function getUrlTo (req, res, next) {
    req.currentUrl.toUrl = await server.urls.find({
      fromUrlId: req.currentUrl._id
    }, {
      projection: {
        title: 1,
        description: 1,
        image: 1,
        'url.0': 1,
        bookmarks: 1
      }
    }).toArray()
    next()
  }
  const getUrlFrom = async function getUrlFrom (req, res, next) {
    req.currentUrl.fromUrl = await server.urls.find({
      toUrlId: req.currentUrl._id
    }, {
        projection: {
          title: 1,
          description: 1,
          image: 1,
          'url.0': 1,
          bookmarks: 1
        }
      }).toArray()
    next()
  }
  const getUrlResponse = async function getUrlResponse (req, res, next) {
    res.status(200).json(req.currentUrl).end()
  }
  server.app.get('/url/:url', getUrlValidation)
  server.app.get('/url/:url', getUrl)
  server.app.get('/url/:url', getUrlTo)
  server.app.get('/url/:url', getUrlFrom)
  server.app.get('/url/:url', getUrlResponse)
}
