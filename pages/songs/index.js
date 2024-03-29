import Navbar from "../../components/Navbar.js"
import Footer from "../../components/Footer.js"
import List from "../../components/List.js"
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import * as Icon from 'react-feather';
import Head from 'next/head'


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

    return (
        <div className="bg-black vh-100">
            <Navbar logo='Home'/>

            <Head>
                <title>Chords list</title>
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <meta name="description" content={'Worlds best songs with lyrics and chords. Autoscroll chords and play video at the same time.'}></meta>
            </Head>

            <button type="button" className='btn btn-outline-warning m-3'
                onClick={() => {
                    router.push('/songs/new')
                }}
            ><Icon.Plus /></button>

            <List
                name='All songs'
                list={songs}
                onSelect={onSelectSong} />

            <Footer />
        </div>
    )
}

// Server
import dbConnect from '../../lib/dbConnect'
import Song from '../../models/Song'

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