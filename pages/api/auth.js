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

    let updateUser = {
        phonenumber: req.body.phonenumber,
        code: ''
    }

    let resPhoneVerify = await fetch(`https://api.nerotech.ru/api/v1/call?service_id=386&secret_key=caa325a407d2d181ed1fffa14970a053&phone=${req.body.phonenumber}`)
    let resPhoneVerifyJson = await resPhoneVerify.json()
    if (resPhoneVerifyJson.code) {
        updateUser.code = resPhoneVerifyJson.code
    }

    await db
        .collection("users")
        .findOneAndUpdate({ phonenumber: updateUser.phonenumber }, { $set: updateUser }, { upsert: true })

    res.status(200).json({ message: 'New code for ' + req.body.phonenumber + ' generated' })
}

