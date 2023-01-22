import mongoose from 'mongoose'
require('./Song');
require('./User');

const PlaylistSchema = new mongoose.Schema({
  name: String,
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

export default mongoose.models.Playlist || mongoose.model('Playlist', PlaylistSchema)
