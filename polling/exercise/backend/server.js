import express from 'express'
import bodyParser from 'body-parser'
import nanobuffer from 'nanobuffer'
import morgan from 'morgan'

// set up a limited array
const msg = new nanobuffer(5)
const getMsgs = () => Array.from(msg).reverse()

// feel free to take out, this just seeds the server with at least one message
msg.push({
  user: 'brian',
  text: 'hi',
  time: Date.now(),
})

// get express ready to run
const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(express.static('frontend'))

app.get('/poll', function (req, res) {
  res.json({
    msg: getMsgs(),
  })
})

app.post('/poll', function (req, res) {
  const { user, text } = req.body // This will be from the form submit
  console.log({ user, text })

  // add to the nanobuffer... which will lose older entries if needs be!
  msg.push({
    user,
    text,
    time: Date.now(),
  })

  res.json({
    status: 'ok',
  })
})

// start the server
const port = process.env.PORT || 3000
app.listen(port)
// const now = Date.now().toDateString()
const now = new Date().toUTCString()
console.log(`listening on http://localhost:${port} @ ${now}`)
