import Navbar from "../../components/Navbar.js"
import Footer from "../../components/Footer.js"
import List from "../../components/List.js"
import { useState, useEffect } from 'react';

export default function playlists(props) {
    const [playlists, setPlaylists] = useState(JSON.parse(props.playlists));

    const onSelectPlaylist = (e) => {
        console.log('onSelectPlaylist');
        const arrindex = e.target.attributes['arrindex'].value
        let newPlaylists = [...playlists]
        newPlaylists[arrindex].selected = true
        setPlaylists(newPlaylists)
    }

    const onCreatePlaylist = () => {
        console.log('onCreatePlaylist');
    }

    const onEditPlaylist = () => {
        console.log('onEditPlaylist');
    }

    const onDeletePlaylist = () => {
        console.log('onDeletePlaylist');
    }

    return (
        <div className="bg-black vh-100">
            <Navbar logo="Best chords" />
            <List
                name='Playlists'
                list={playlists}
                onSelect={onSelectPlaylist} 
                onCreateItem={onCreatePlaylist}
                onEditItem={onEditPlaylist}
                onDeleteItem={onDeletePlaylist}
                />
            <Footer />
        </div >
    )
}

// Server
export async function getServerSideProps(context) {

    const commonServer = (await import('../../commonServer.js'))
    let mongoConnection = await commonServer.mongoConnection()

    const db = mongoConnection.db("chords");

    const playlists = await db
        .collection("playlists")
        .find({})
        .sort({ name: 1 })
        .toArray();

    let result = []
    if (playlists.length > 0) {
        for (const playlist of playlists) {
            result.push({ 
                label: playlist.name, 
                value: '/playlists/' +  playlist._id })
        }
    }

    return {
        props: { 'playlists': JSON.stringify(result) },
    }
}