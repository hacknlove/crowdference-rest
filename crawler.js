
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

  server.randomId = function randomId () {
    return `${Math.random().toString(36).replace(/^0./, '')}${Math.random().toString(36).replace(/^0./, '')}${Math.random().toString(36).replace(/^0./, '')}`.substr(0, 17)
  }

  server.ogs = require('open-graph-scraper')

  server.getUrl = async function getUrl (url) {
    return await server.urls.findOne({
      url
    }) || server.insertUrl(await server.updateUrl(url))
  }


  server.insertUrl = async function insertUrl(url) {
    if (!url) {
      return
    }
    const l = await server.urls.findOne({
      url: {
        $in: url.url
      }
    })

    if (l) {
      server.urls.update(l._id, {
        $addToSet: {
          url: {
            $each: url.url
          }
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
      url,
      headers: {
        'User-Agent': 'FeedFetcher-Google; (+http://www.google.com/feedfetcher.html)',
        'Accept-Language': 'en-US, en'
      }
    }

    response = await server.ogs(opciones)
    console.log(url)
    console.log(url)
    if (!response) {
      return
    }

    if (!response.data) {
      return
    }

    if (response.data.ogUrl) {
      url = Array.from(new Set([response.data.ogUrl, url]))
    } else {
      url = [url]
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
