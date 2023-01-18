import Navbar from "../../components/Navbar.js"
import Footer from "../../components/Footer.js"
import List from "../../components/List.js"
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

    const commonServer = (await import('../../commonServer.js'))
    let mongoConnection = await commonServer.mongoConnection()

    const db = mongoConnection.db("chords");

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
                value: '/songs/' + song.url,
                selected: false
            })
        }
    }

    return {
        props: { 'songs': JSON.stringify(result) },
    }
}