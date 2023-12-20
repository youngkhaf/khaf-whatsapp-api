require('./routes')
const { restoreSessions } = require('./sessions')
const { routes } = require('./routes')
const app = require('express')()
const bodyParser = require('body-parser')
const { maxAttachmentSize } = require('./config')
const { Server } = require('socket.io')
const cors = require('cors')
const { socketClientStore } = require('./socketClientStore')
const { globalApiKey } = require('./config')
// Initialize Express app
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  optionsSuccessStatus: 204
}
app.disable('x-powered-by')
app.use(cors(corsOptions))
app.options('*', cors())
app.use(bodyParser.json({ limit: maxAttachmentSize + 1000000 }))
app.use(bodyParser.urlencoded({ limit: maxAttachmentSize + 1000000, extended: true }))
app.use('/', routes)
const server = require('http').createServer(app)
const socketServer = new Server(server)
socketServer.on('connection', (socket) => {
  const authKeys = socket.request.headers
  console.log({ authKeys })

  if (globalApiKey) {
    const apiKey = socket.request.headers['x-api-key']
    if (!apiKey || apiKey !== globalApiKey) {
      socket.emit('error', 403 + '  : Invalid API key')
    }
  }
  const sessionId = socket.request.headers.sessionid
  if (sessionId) {
    socket.join(sessionId)
  } else {
    socket.emit('error', 403 + '  : Invalid Session Id')
  }
})
socketServer.on('disconnect', (socket) => {
  socketClientStore.set('a', [...(socketClientStore.get('a') || []).filter(a => a !== socket.id)])
})

restoreSessions()

module.exports = { server, socketServer }
