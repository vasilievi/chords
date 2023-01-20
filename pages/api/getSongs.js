// Server
import dbConnect from '../../lib/dbConnect'
import Song from '../../models/Song'

export default async function handler(req, res) {
    if (req.method === 'GET') {

        await dbConnect()
        const songs = await Song.find({ name: { $regex: req.query.name.toLowerCase(), $options: 'i' } })
    
        let result = []
        if (songs.length > 0) {
            for (const song of songs) {
                result.push({ value: song.url, label: song.name, _id: song._id })
            }
        }

        res.status(200).json({ message: 'Ok', songs: result })


    } else {
        res.status(500).json({ message: 'Use get request!' })
    }
}