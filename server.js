'use strict'
module.exports = {
  version: '1.0.0',
  conf: {
    host: process.env.HOST,
    maxPayload: 512,
    heartbeat: 60,
    lastN: 10,
    trackers: [
      // {
      //   url: 'https://foo.bar',
      //   lastN: 3
      // },
      // {
      //   url: 'https://foo.bar',
      //   lastN: 3
      // }
    ]
  },
  setTimeout (callback, timeout) {
    return setTimeout(callback, timeout)
  }
}
