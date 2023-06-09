import { useState, useEffect } from 'react';


export default function sitemap(props) {
    const EXTERNAL_DATA_URL = 'https://chords-one.vercel.app';
    const [songs, setSongs] = useState(JSON.parse(props.songs));

    return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>https://chords-one.vercel.app</loc>
     </url>
     <url>
       <loc>https://chords-one.vercel.app/songs/</loc>
     </url>
     ${songs
            .map(({ value }) => {
                return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}${value}`}</loc>
       </url>
     `;
            })
            .join('')}
   </urlset>
 `;
}

// Server
import dbConnect from '../lib/dbConnect'
import Song from '../models/Song'

//export async function getServerSideProps(context) {
export async function getStaticProps(context) {

    await dbConnect()
    const songs = await Song.find().sort({ name: 1 })

    let result = []
    if (songs.length > 0) {
        for (const song of songs) {
            result.push({
                label: song.name,
                value: '/songs/' + song.url,
                selected: false
            })
        }
    }

    return {
        props: { 'songs': JSON.stringify(result) },
        revalidate: 10,
    }
}
