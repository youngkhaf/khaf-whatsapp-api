const { createClient } = require('redis')
let redisClient = null
try {
  redisClient = createClient({
    retry_strategy: function (options) {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        // If redis refuses the connection or is not able to connect
        return new Error('The server refused the connection')
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        // End reconnection after the specified time limit
        return new Error('Retry time exhausted')
      }
      if (options.attempt > 10) {
        // End reconnecting with built in error
        return undefined
      }
      // reconnect after
      return 300000
    },
    url: 'redis://api.sentek.app:6379',
    password: 'gRuL£TED65A5>TjQ15x'
  })
  redisClient.connect()

  redisClient.on('ready', () => {
    console.log('Redis ready')
  })

  redisClient.on('error', (err) => {
    console.error('Redis error:', err)
  })
  redisClient.on('connect', () => {
    console.log('Connected to Redis')
  })
} catch (err) {
  console.error('Redis error:', err)
  // return a "moked" redis instance
  redisClient = {
    set: () => null,
    get: () => null
  }
}

module.exports = redisClient
