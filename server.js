const { server } = require('./src/app')
require('dotenv').config()

// Start the server
const port = process.env.PORT || 3000

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
