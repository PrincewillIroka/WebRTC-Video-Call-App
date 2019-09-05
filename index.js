const express = require('express')
const bodyParser = require('body-parser')
const Pusher = require('pusher')
const dotenv = require('dotenv')
const app = express()
dotenv.config()
const port = process.env.PORT

// Body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// Session middleware

// Create an instance of Pusher
const pusher = new Pusher({
  appId: process.env.appId,
  key: process.env.key,
  secret: process.env.secret,
  cluster: process.env.cluster,
  useTLS: process.env.useTLS
})

app.get('/', (req, res) => {
  return res.sendFile(__dirname + '/index.html')
})

app.get('/data', (req, res) => res.json(process.env.key))

//listen on the app
app.listen(port, () => {
  return console.log(`Server is up on ${port}`)
})

// get authentictation for the channel;
app.post('/pusher/auth', (req, res) => {
  const socketId = req.body.socket_id
  const channel = req.body.channel_name
  const presenceData = {
    user_id:
      Math.random()
        .toString(36)
        .slice(2) + Date.now()
  }
  const auth = pusher.authenticate(socketId, channel, presenceData)
  res.send(auth)
})
