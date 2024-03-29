import mongoose from 'mongoose'

const SongSchema = new mongoose.Schema({
  url: String,
  name: String,
  text: String,
  key: String,
  video: String,
  scrollSpeed: Number
})

export default mongoose.models.Song || mongoose.model('Song', SongSchema)
