
const rrss = {
  Instagram (response) {
    response.description = response.title.replace(/^.*?on Instagram: /, '')
    response.title = response.title.replace(/on Instagram:.*$/, '')
    return response
  },
  Twitter (response) {
    response.title = response.title.replace(/on Twitter$/, '')
    return response
  },
  reddit (response) {
    response.description = response.title.replace(/^.*?- /, '')
    response.title = response.title.replace(/ - .*$/, '')
    return response
  }
}

module.exports = function (server) {
  server.removeProtocol = function removeProtocol (url) {
    return url.replace(/^http(s)?:\/\//, '')
  }

  server.randomId = function randomId () {
    return `${Math.random().toString(36).replace(/^0./, '')}${Math.random().toString(36).replace(/^0./, '')}${Math.random().toString(36).replace(/^0./, '')}`.substr(0, 17)
  }

  server.ogs = require('open-graph-scraper')

  server.getUrl = async function getUrl (url) {
    url = server.removeProtocol(url)
    return await server.urls.findOne({
      url
    }) || server.insertUrl(await server.updateUrl(url))
  }

  server.insertUrl = async function insertUrl (url) {
    if (!url) {
      return
    }
    const l = await server.urls.findOne({
      url: {
        $in: url.url
      }
    })

    if (l) {
      l.url.splice(3)
      l.url.push(url.url)

      server.urls.update(l._id, {
        $set: {
          url: l.url
        }
      })
      return l
    }

    url._id = server.randomId()
    url.contentUpdated = new Date()
    url.lastActivity = new Date()
    url.bookmarks = 0
    url.totalLinks = 0
    url.totalBackLinks = 0
    url.toUrlId = []
    url.fromUrlId = []
    url.votesFrom = {}
    url.votesTo = {}
    url.ids = [url._id]

    server.urls.insertOne(url)
    return url
  }

  server.updateUrl = async function updateUrl (url) {
    var response
    var opciones = {
      url: `https://${url}`,
      headers: {
        'User-Agent': 'FeedFetcher-Google; (+http://www.google.com/feedfetcher.html)',
        'Accept-Language': 'en-US, en'
      }
    }
    response = await server.ogs(opciones)
    if (!response) {
      return
    }

    if (!response.data) {
      return
    }

    if (response.data.ogUrl) {
      url = Array.from(new Set([
        server.removeProtocol(response.data.ogUrl),
        server.removeProtocol(url)
      ]))
    } else {
      url = [server.removeProtocol(url)]
    }

    var siteName = response.data.ogSiteName || response.data.twitterSite
    var image = (response.data.ogImage || {})
    response = {
      description: response.data.ogDescription,
      title: response.data.ogTitle,
      image: image.secure_url || image.url || undefined,
      url: url
    }

    if (rrss[siteName]) {
      return rrss[siteName](response)
    }
    return response
  }
}
