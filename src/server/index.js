import http from 'http'
import express from 'express'
import mongoose from 'mongoose'
import socketio from 'socket.io'
import redis from 'socket.io-redis'
import api from 'src/server/api'
import { incrementVote } from 'src/server/lib'

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/tvify')

app.use(express.static('public'))
app.use('/api', api)

io.adapter(redis({ host: 'localhost', port: 6379 }))

io.on('connection', (socket) => {
  console.log(`Connected ${socket.id} on instance ${port}`)

  socket.on('vote', id => {
    incrementVote(id, (err, vote) => {
      if (err) return socket.emit('vote:error', err)

      io.sockets.emit('vote:done', vote)
    })
  })

  socket.on('join', room => {
    socket.room = room
    socket.join(room)
  })

  socket.on('message', msg => {
    socket.broadcast.to(socket.room).emit('message', msg)
  })
})

server.listen(port, () => console.log(`Server listening on port ${port}`))
