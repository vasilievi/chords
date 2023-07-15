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

    let result = '/'
    let i = 0
    for (const song of songs) {
        if (song._id == req.query.id) {
            if (i === 0) i = 1
            result = songs[i - 1].url
            break
        }
        i++
    }

    res.status(200).json({ message: 'Ok', song: result })

}