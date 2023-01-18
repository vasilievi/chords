import { ObjectId } from 'mongodb'
import { useState, useEffect } from 'react';
import Navbar from "../../components/Navbar.js"
import Footer from "../../components/Footer.js"
import List from "../../components/List.js"
import * as Icon from 'react-feather';
import classNames from "classnames";

export default function playlist(props) {
    const [playlist, setPlaylist] = useState(JSON.parse(props.playlist));
    const [editMode, setEditMode] = useState(false);
    const [spinner, setSpinner] = useState(false);

    const onSelectSong = () => {

    }
    const onCreateSongItem = () => {

    }

    return (
        <div className="bg-black vh-100">
            <Navbar logo='Home' />

            <List
                name={playlist.name}
                list={playlist.songs}
                onSelect={onSelectSong}
                onCreateItem={onCreateSongItem}
            />

            <Footer />
        </div>
    )
}

// Server
export async function getServerSideProps(context) {

    const commonServer = (await import('../../commonServer.js'))
    let mongoConnection = await commonServer.mongoConnection()

    const db = mongoConnection.db("chords");

    const playlist = await db
        .collection("playlists")
        .findOne({ _id: ObjectId(context.params.url) })

    const songsOfPlaylist = await db
        .collection("songs")
        .find({ _id: { $in: playlist.songs } })
        .sort({ name: 1 })
        .toArray()

    let result = { name: 'New', songs: [] }
    if (playlist) {
        result.name = playlist.name
        result._id = playlist._id

        for (const song of songsOfPlaylist) {
            result.songs.push({
                label: song.name,
                value: '/songs/' + song.url,
                selected: false
            })
        }
    }

    return {
        props: { 'playlist': JSON.stringify(result) },
    }
}