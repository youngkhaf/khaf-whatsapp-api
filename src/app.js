require('./routes')
const { restoreSessions } = require('./sessions')
const { routes } = require('./routes')
const app = require('express')()
const bodyParser = require('body-parser')
const { maxAttachmentSize } = require('./config')
var cors = require('cors')
// Initialize Express app

app.disable('x-powered-by')
app.use(cors())
app.use(bodyParser.json({ limit: maxAttachmentSize + 1000000 }))
app.use(bodyParser.urlencoded({ limit: maxAttachmentSize + 1000000, extended: true }))
app.use('/', routes)

restoreSessions()

module.exports = app
