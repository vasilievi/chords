import { MongoClient } from 'mongodb'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(500).json({ message: 'Use post request!' })
    }

    if (!process.env.MONGODB_URI) {
        throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
    }

    const uri = process.env.MONGODB_URI
    const options = {}

    const client = new MongoClient(uri, options)
    const clientPromise = await client.connect()

    const db = clientPromise.db("chords");

    const users = await db
        .collection("users")
        .find({ phonenumber: req.body.phonenumber })
        .toArray();

    let result = false
    if (users.length > 0) {
        if (users[0].code === req.body.code) result = true
    }

    if(result) res.status(200).json({ message: 'Ok'})
    if(!result) res.status(401).json({ message: 'Auth failed'})
}