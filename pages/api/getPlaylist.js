import dbConnect from '../../lib/dbConnect'
import Playlist from '../../models/Playlist'

export default async function getPlaylist(req, res) {
    if (req.method !== 'GET') {
        res.status(500).json({ message: 'Use GET request!' })
    }

    try {
        await dbConnect()
        const playlist = await Playlist
            .findById(req.query._id)
            .populate('songs')

        let songs = []
        for (const song of playlist.songs) {
            songs.push({
                label: song.name,
                value: '/songs/' + song.url,
                selected: false
            })
        }

        res.status(200).json({
            message: 'Ok',
            playlist: playlist,
            songs: songs
        })
    } catch (error) {
        res.status(500).json({ message: 'Playlist not found' })
    }

}