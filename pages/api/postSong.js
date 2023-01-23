import dbConnect from '../../lib/dbConnect'
import Song from '../../models/Song'
import mongoose from 'mongoose'
import * as commonServer from '../../commonServer.js'


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(500).json({ message: 'Use post request!' })
        return
    }

    const tokenIsValid = await commonServer.checkToken(req.headers["x-auth-token"])
    if(!tokenIsValid) {
        res.status(401).json({ message: 'Token is not valid!' })
        return
    }

    if(!req.body._id) req.body._id = mongoose.Types.ObjectId();

    await dbConnect()
    await Song.findByIdAndUpdate(
        req.body._id,
        req.body,
        {
            new: true,
            upsert: true
        })

    res.status(200).json({ message: 'Stored successfully' })
}