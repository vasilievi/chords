import dbConnect from '../../lib/dbConnect'
import User from '../../models/User'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(500).json({ message: 'Use post request!' })
    }

    await dbConnect()
    let user = await User
        .findOne({ phonenumber: req.body.phonenumber })

    let token = generateToken(32)
    if (user) token = user.token

    let updateUser = {
        phonenumber: req.body.phonenumber,
        code: '',
        token: token
    }

    let resPhoneVerify = await fetch(`https://api.nerotech.ru/api/v1/call?service_id=386&secret_key=${process.env.NEROTECH_KEY}&phone=7${req.body.phonenumber}`)
    let resPhoneVerifyJson = await resPhoneVerify.json()
    if (resPhoneVerifyJson.code) {
        updateUser.code = resPhoneVerifyJson.code
    }

    await User.findOneAndUpdate(
        {
            phonenumber: updateUser.phonenumber
        },
        updateUser,
        {
            new: true,
            upsert: true
        })

    res.status(200).json({ message: 'New code for ' + req.body.phonenumber + ' generated' })
}

function generateToken(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        result += charset.charAt(Math.floor(Math.random() * n));
    }
    return result;
}

