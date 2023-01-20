import mongoose from 'mongoose'
require('./Song');

const PlaylistSchema = new mongoose.Schema({
  name: String,
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
})

export default mongoose.models.Playlist || mongoose.model('Playlist', PlaylistSchema)
