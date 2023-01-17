import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
    if (req.method === 'POST') {

        const commonServer = (await import('../../commonServer.js'))
        let mongoConnection = await commonServer.mongoConnection()
    
        const db = mongoConnection.db("chords");

        const id = req.body._id
        delete req.body._id

        await db
            .collection("songs")
            .findOneAndUpdate({ _id: ObjectId(id) }, {$set: req.body}, { upsert: true })

        res.status(200).json({ message: 'Stored successfully' })

    } else {
        res.status(500).json({ message: 'Use post request!' })
    }
}