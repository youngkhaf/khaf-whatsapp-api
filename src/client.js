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

  const prospectMap = new Map()
  for (const chat of chats) {
    prospectMap.set(chat.id._serialized, { chat, contact: null })
  }
  for (const contact of contacts) {
    const prospect = prospectMap.get(contact.id._serialized)
    if (prospect) {
      prospect.contact = contact
    } else {
      prospectMap.set(contact.id._serialized, { chat: null, contact })
    }
  }
  const prospects = [...prospectMap.values()].sort((a, b) => a.chat?.lastMessage?.timestamp - b.chat?.lastMessage?.timestamp)
  const retentionTime = 60 * 60 * 10 // 10 hours
  redisClient.set(key, JSON.stringify(prospects), 'EX', retentionTime)
  return prospects
}
module.exports = { getClientProspects }
