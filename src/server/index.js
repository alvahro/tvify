import http from 'http'
import express from 'express'
import mongoose from 'mongoose'
import socketio from 'socket.io'
import api from 'src/server/api'

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/tvify')

app.use(express.static('public'))
app.use('/api', api)

io.on('connection', (socket) => {
  console.log(`Connected ${socket.id}`)

  socket.on('ping', _ => {
    console.log('PONG')
  })
})

server.listen(port, () => console.log(`Server listening on port ${port}`))
