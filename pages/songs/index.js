import Navbar from "../../components/Navbar.js"
import Footer from "../../components/Footer.js"
import List from "../../components/List.js"
import { MongoClient } from 'mongodb'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';



export default function songs(props) {
    const [songs, setSongs] = useState(JSON.parse(props.songs));
    const router = useRouter()

    const onSelectSong = (e) => {
        console.log('onSelectSong');
        const arrindex = e.target.attributes['arrindex'].value
        let newSongs = [...songs]
        newSongs[arrindex].selected = true
        setSongs(newSongs)
    }

    const onCreateSongItem = (e) => {
        console.log('onCreateSongItem');
        router.push('/songs/new')
    }

    return (
        <div className="bg-black vh-100">
            <Navbar logo="Home" />
            <List
                name='All songs'
                list={songs}
                onSelect={onSelectSong}
                onCreateItem={onCreateSongItem}/>
            <Footer />
        </div>
    )
}

// Server
export async function getServerSideProps(context) {

    if (!process.env.MONGODB_URI) {
        throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
    }

    const uri = process.env.MONGODB_URI
    const options = {}

    const client = new MongoClient(uri, options)
    const clientPromise = await client.connect()

    const db = clientPromise.db("chords");

    const songs = await db
        .collection("songs")
        .find({})
        .sort({ name: 1 })
        .toArray();

    let result = []
    if (songs.length > 0) {
        for (const song of songs) {
            result.push({
                label: song.name,
                value: song.url,
                selected: false
            })
        }
    }

    return {
        props: { 'songs': JSON.stringify(result) },
    }
}