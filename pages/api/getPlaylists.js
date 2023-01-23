import dbConnect from '../../lib/dbConnect'
import Playlist from '../../models/Playlist'

export default async function getPlaylist(req, res) {
    if (req.method !== 'GET') {
        res.status(500).json({ message: 'Use GET request!' })
        return
    }

    try {
        await dbConnect()
        const playlists = await Playlist
            .find({ user: req.query.userid })

        let result = []
        if (playlists.length > 0) {
            for (const playlist of playlists) {
                result.push({
                    label: playlist.name,
                    value: '/playlists/' + playlist._id
                })
            }
        }

        res.status(200).json({
            message: 'Ok',
            playlists: result
        })
    } catch (error) {
        res.status(500).json({ message: 'Playlists not found' })
    }

}