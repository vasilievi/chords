// Server
import dbConnect from '../../lib/dbConnect'
import Song from '../../models/Song'

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(500).json({ message: 'Use GET request!' })
        return
    }

    await dbConnect()
    const songs = await Song.find().sort({ name: 1 })

    let result = songs[Math.round((songs.length-1)*Math.random())].url
    res.status(200).json({ message: 'Ok', song: result })

}