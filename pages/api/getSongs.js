
export default async function handler(req, res) {
    if (req.method === 'GET') {
        const commonServer = (await import('../../commonServer.js'))
        let mongoConnection = await commonServer.mongoConnection()
    
        const db = mongoConnection.db("chords");

        const songs = await db
            .collection("songs")
            .find({ name: { $regex: req.query.name.toLowerCase(), $options: 'i' } })
            .sort({ name: 1 })
            .toArray();

        let result = []
        if (songs.length > 0) {
            for (const song of songs) {
                result.push({ value: song.url, label: song.name })
            }
        }

        res.status(200).json({ message: 'Ok', songs: result })


    } else {
        res.status(500).json({ message: 'Use get request!' })
    }
}