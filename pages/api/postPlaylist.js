import dbConnect from '../../lib/dbConnect'
import Playlist from '../../models/Playlist'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(500).json({ message: 'Use post request!' })
    }

    await dbConnect()
    await Playlist.findOneAndUpdate(
        req.body._id,
        req.body,
        {
            new: true,
            upsert: true
        })

    res.status(200).json({ message: 'Stored successfully' })

}