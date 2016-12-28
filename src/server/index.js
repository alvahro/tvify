import http from 'http'
import express from 'express'
import api from 'src/server/api'
import mongoose from 'mongoose'
import socketio from 'socket.io'

const app = express()
/*
 * No va a ser Express quien maneje el servidor web http, sino que lo vamos a
 * hacer manualmente sin con el modulo nativo http.
 * Sin embargo, al pasar la app de Express como argumetno a createServer()
 * vamos a permitr a Express manejar los requests.
 * Esto lo hacemos para poder "enganchar" SocketIO al servidor web http.
 */
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/tvify')

app.use(express.static('public'))

/*
 * SocketIO al igual que node se basa en una metodologia de EVENTOS. El parametro
 * socket representa el canal o socket entre un cliente especifico y el servidor.
 */
io.on('connection', (socket) => {
  console.log('Connected ${socket.id}') // cada socket tiene un id
  socket.on('ping', () => socket.emit('pong'))
})

app.use('/api', api)

server.listen(port, () => console.log(`Server listening on port ${port}`))
