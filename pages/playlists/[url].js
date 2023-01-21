import { useState, useEffect } from 'react';
import Navbar from "../../components/Navbar.js"
import Footer from "../../components/Footer.js"
import List from "../../components/List.js"
import * as Icon from 'react-feather';
import classNames from "classnames";
import AsyncSelect from 'react-select/async';


export default function playlist() {
    const [playlist, setPlaylist] = useState({ name: "new" });
    const [songs, setSongs] = useState([]);

    const [filterTimeoutState, setfilterTimeoutState] = useState('')
    const [editMode, setEditMode] = useState(false);
    const [spinner, setSpinner] = useState(false);

    useEffect(() => {
        console.log('useEffect');
        getPlaylist()
    }, [])

    const getPlaylist = async () => {
        const _id = window.location.pathname.replace('/playlists/', '')
        const res = await fetch('/api/getPlaylist?_id=' + _id)
        const resJson = await res.json()

        if (res.status !== 200) {
            console.log(resJson);
            return
        }

        setPlaylist(resJson.playlist)
        setSongs(resJson.songs)
    }

    const loadOptions = (inputValue, callback) => {
        // setTimeout for debounce
        clearTimeout(filterTimeoutState)
        setfilterTimeoutState(setTimeout(() => {
            console.log('loadOptions');
            fetch('/api/getSongs?name=' + inputValue)
                .then((res) => res.json())
                .then((resJson) => callback(resJson.songs))
        }, 500))
    }

    const onSelectSong = (e) => {
        console.log('onSelectSong');
        const arrindex = e.target.attributes['arrindex'].value
        let newSongs = [...songs]
        newSongs[arrindex].selected = true
        setSongs(newSongs)
    }

    const edit = async () => {
        setSpinner(true)
        const common = (await import('../../commonClient.js'))
        let authorized = await common.checkAuth()
        setSpinner(false)

        if (authorized) {
            setEditMode(true)
        } else {
            router.push('/login')
        }
    }

    const save = async (e) => {
        console.log('save');
        e.target.disabled = true
        setSpinner(true)

        let response = await fetch('/api/postPlaylist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(playlist)
        });

        if (response.status === 200) {
            setEditMode(false)
        }

        if (response.status !== 200) {
            let result = response.json()
            console.log(result);
        }

        e.target.disabled = false
        setSpinner(false)

    }

    return (
        <div className="bg-black vh-100">
            <Navbar logo='Home' />

            <div className='row m-3'>
                <div className='col-auto'>
                    <button
                        className={classNames('btn', 'btn-outline-warning', { 'd-none': !editMode })}
                        onClick={save}
                    >Save</button>

                    <button
                        className={classNames('btn', 'btn-outline-light', { 'd-none': editMode })}
                        onClick={edit}
                    ><Icon.Edit /></button>
                </div>
                <div className='col-auto'>
                    <div
                        className={classNames("spinner-grow", "text-light", { 'd-none': !spinner })}
                        role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>

                </div>
            </div>

            <List
                name={playlist.name}
                list={songs}
                onSelect={onSelectSong}
            />

            <AsyncSelect
                id="long-value-select"
                instanceId="long-value-select"
                className={classNames("text-dark", "m-3", { 'd-none': !editMode })}
                defaultOptions={[]}
                loadOptions={loadOptions}
                placeholder='Add song'
                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                onChange={(selectedValue) => {
                    console.log('onChange');
                    // let newSongs = [...songs]
                    // newSongs.push(selectedValue)
                    setPlaylist({
                        ...playlist,
                        songs: [...playlist.songs, selectedValue._id]
                    })
                    setSongs([...songs, selectedValue])
                }}
            />


            <Footer />
        </div>
    )
}
