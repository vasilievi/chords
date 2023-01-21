import Navbar from "../../components/Navbar.js"
import Footer from "../../components/Footer.js"
import List from "../../components/List.js"
import { useState, useEffect } from 'react';
import * as Icon from 'react-feather';
import { useRouter } from 'next/router'

export default function playlists(props) {
    const router = useRouter()
    const [playlists, setPlaylists] = useState(JSON.parse(props.playlists));

    const onSelectPlaylist = (e) => {
        console.log('onSelectPlaylist');
        const arrindex = e.target.attributes['arrindex'].value
        let newPlaylists = [...playlists]
        newPlaylists[arrindex].selected = true
        setPlaylists(newPlaylists)
    }

    return (
        <div className="bg-black vh-100">
            <Navbar logo="Best chords" />

            <button type="button" className='btn btn-outline-warning m-3'
                onClick={() => {
                    router.push('/playlists/new')
                }}
            ><Icon.Plus /></button>

            <List
                name='Playlists'
                list={playlists}
                onSelect={onSelectPlaylist}
            />
            <Footer />
        </div >
    )
}

// Server
import dbConnect from '../../lib/dbConnect'
import Playlist from '../../models/Playlist'

export async function getServerSideProps(context) {

    await dbConnect()
    const playlists = await Playlist.find()

    let result = []
    if (playlists.length > 0) {
        for (const playlist of playlists) {
            result.push({
                label: playlist.name,
                value: '/playlists/' + playlist._id
            })
        }
    }

    return {
        props: { 'playlists': JSON.stringify(result) },
    }
}