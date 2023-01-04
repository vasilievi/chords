import { MongoClient } from 'mongodb'

export default async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }

    const uri = process.env.MONGODB_URI
    const options = {}
    const client = new MongoClient(uri, options)
    const clientPromise = await client.connect()

    const db = clientPromise.db("chords");
    const collection = db.collection("songs");

    const result = await collection.insertOne(req.body);

    res.status(200).send({ message: 'Data stored' })
};