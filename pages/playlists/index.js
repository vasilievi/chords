import Navbar from "../../components/Navbar.js"
import Footer from "../../components/Footer.js"
import List from "../../components/List.js"
import { useState, useEffect } from 'react';
import * as Icon from 'react-feather';
import { useRouter } from 'next/router'
import * as common from '../../commonClient.js'
import classNames from "classnames";



export default function playlists() {
    const router = useRouter()
    const [playlists, setPlaylists] = useState([]);
    const [spinner, setSpinner] = useState(false);

    useEffect(() => {
        console.log('useEffect');
        getPlaylists()
    }, [])


    const getPlaylists = async () => {
        setSpinner(true)
        const res = await fetch('/api/getPlaylists?userid=' + common.userId())
        const resJson = await res.json()

        if (res.status !== 200) {
            console.log(resJson);
            return
        }

        setPlaylists(resJson.playlists)
        setSpinner(false)
    }

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
            <div
                className={classNames("spinner-grow", "text-light", { 'd-none': !spinner })}
                role="status">
                <span className="visually-hidden">Loading...</span>
            </div>

            <button type="button" className='btn btn-outline-light m-3'
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
// import dbConnect from '../../lib/dbConnect'
// import Playlist from '../../models/Playlist'

// export async function getServerSideProps(context) {

//     await dbConnect()
//     const playlists = await Playlist.find()

//     let result = []
//     if (playlists.length > 0) {
//         for (const playlist of playlists) {
//             result.push({
//                 label: playlist.name,
//                 value: '/playlists/' + playlist._id
//             })
//         }
//     }

//     return {
//         props: { 'playlists': JSON.stringify(result) },
//     }
// }