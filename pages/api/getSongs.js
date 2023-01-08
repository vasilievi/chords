import { MongoClient } from 'mongodb'

export default async function handler(req, res) {
    if (req.method === 'GET') {
        if (!process.env.MONGODB_URI) {
            throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
        }

        const uri = process.env.MONGODB_URI
        const options = {}

        const client = new MongoClient(uri, options)
        const clientPromise = await client.connect()

        const db = clientPromise.db("chords");

        const songs = await db
            .collection("songs")
            .find({ name: { $regex: req.query.name.toLowerCase(), $options: 'i' } })
            .sort({ name: 1 })
            .toArray();

        let result = []
        if (songs.length > 0) {
            for (const song of songs) {
                result.push({ value: song.url, label: song.name })
            }
        }

        res.status(200).json({ message: 'Ok', songs: result })


    } else {
        res.status(500).json({ message: 'Use get request!' })
    }
}