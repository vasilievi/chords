import dbConnect from '../../lib/dbConnect'
import User from '../../models/User'

export default async function checkAuth(req, res) {
    if (req.method !== 'POST') {
        res.status(500).json({ message: 'Use post request!' })
    }

    await dbConnect()
    let user = await User
        .findOne({
            token: req.body.token
        })

    if (!user) {
        user = await User
            .findOne({
                phonenumber: req.body.phonenumber,
                code: req.body.code
            })
    }

    if (user) res.status(200).json({ message: 'Ok', user: user })
    if (!user) res.status(401).json({ message: 'Auth failed' })
}