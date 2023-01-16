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

    let user = await db
        .collection("users")
        .findOne({
            token: req.body.token
        })

    if (!user) {
        user = await db
            .collection("users")
            .findOne({
                phonenumber: req.body.phonenumber,
                code: req.body.code
            })
    }

    if (user) res.status(200).json({ message: 'Ok', user: user })
    if (!user) res.status(401).json({ message: 'Auth failed' })
}