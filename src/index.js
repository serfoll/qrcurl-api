require('dotenv').config()

const express = require('express')
const cors = require('cors')

const app = express()

// Middlewares
app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1>Hello, world</h1>')
})

const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log(`App runing on http://localhost:${port}`)
})
