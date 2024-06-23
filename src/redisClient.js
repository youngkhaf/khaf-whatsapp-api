const { createClient } = require('redis')
let redisClient = null
try {
  redisClient = createClient({
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
}

module.exports = redisClient
