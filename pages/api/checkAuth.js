
export default async function checkAuth(req, res) {
    if (req.method !== 'POST') {
        res.status(500).json({ message: 'Use post request!' })
    }

    const commonServer = (await import('../../commonServer.js'))
    let mongoConnection = await commonServer.mongoConnection()

    const db = mongoConnection.db("chords");

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