import express from 'express'
import api from 'src/server/api'
import mongoose from 'mongoose'

const app = express()
const port = process.env.PORT || 3000

// TESTING
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/tvify')

console.log(process.env.MONGOLAB_URI)

app.use(express.static('public'))

app.use('/api', api)

app.listen(port, () => console.log(`Server listening on port ${port}`))
