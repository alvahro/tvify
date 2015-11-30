import mongoose, { Schema } from 'mongoose'

let VoteSchema = new Schema({
  showId: { type: Number, required: true, unique: true },
  count: { type: Number, default: 0 }
})

let model = mongoose.model('Vote', VoteSchema)

export default model
