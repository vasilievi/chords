const Sitemap = () => {
    return null
}

// Server
import dbConnect from '../lib/dbConnect'
import Song from '../models/Song'

export const getServerSideProps = async ({ res }) => {
    await dbConnect()
    const songs = await Song.find().sort({ name: 1 })


    const EXTERNAL_DATA_URL = 'https://chords-one.vercel.app';

    const sitemap =
        `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!--We manually set the two URLs we know already-->
    <url>
    <loc>${EXTERNAL_DATA_URL}</loc>
    </url>
    <url>
    <loc>${EXTERNAL_DATA_URL}/songs/</loc>
    </url>
    ${songs.map(({ url }) => {
        return `<url>
                    <loc>${`${EXTERNAL_DATA_URL}/songs/${url}`}</loc>
                </url>`;
    }).join('')}
    </urlset>`

    res.setHeader('Content-Type', 'text/xml')
    res.write(sitemap)
    res.end()

    return {
        props: {}
    }
}

export default Sitemap