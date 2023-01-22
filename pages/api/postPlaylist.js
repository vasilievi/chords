import dbConnect from '../../lib/dbConnect'
import Playlist from '../../models/Playlist'
import mongoose from 'mongoose'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(500).json({ message: 'Use post request!' })
    }

    if(!req.body._id) req.body._id = mongoose.Types.ObjectId();

    await dbConnect()
    let playlist = await Playlist.findByIdAndUpdate(
        req.body._id,
        req.body,
        {
            new: true,
            upsert: true
        })

    res.status(200).json({ message: 'Stored successfully', playlist: playlist })

}