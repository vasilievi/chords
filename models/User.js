import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  phonenumber: String,
  code: String,
  token: String,
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
