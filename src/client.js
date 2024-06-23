const redisClient = require('./redisClient')

const getClientProspects = async (client, sessionId, ignoreCache) => {
  const key = `prospects:${sessionId}`
  if (!ignoreCache) {
    const cachedProspects = await redisClient.get(key)
    if (cachedProspects) {
      console.log('Returning cached prospects')
      return JSON.parse(cachedProspects)
    }
  }
  console.log('Not found in cache, fetching from API')
  const contacts = await client.getContacts()
  const chats = await client.getChats()
  const prospects = chats.map(chat => {
    const contact = contacts.find(contact => contact.id._serialized === chat.id._serialized)
    return { chat, contact }
  }).sort((a, b) => a.chat.lastMessage.timestamp - b.chat.lastMessage.timestamp)
  const retentionTime = 60 * 60 * 10 // 10 hours
  redisClient.set(key, JSON.stringify(prospects), 'EX', retentionTime)
  return prospects
}
module.exports = { getClientProspects }
