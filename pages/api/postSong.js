import { MongoClient } from 'mongodb'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        if (!process.env.MONGODB_URI) {
            throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
        }

        const uri = process.env.MONGODB_URI
        const options = {}

        const client = new MongoClient(uri, options)
        const clientPromise = await client.connect()

        const db = clientPromise.db("chords");

        await db
            .collection("songs")
            .findOneAndUpdate({ url: req.body.url }, {$set: req.body}, { upsert: true })

        res.status(200).json({ message: 'Stored successfully' })


    } else {
        res.status(500).json({ message: 'Use post request!' })
    }
}