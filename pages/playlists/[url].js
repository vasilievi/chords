import { useState, useEffect } from 'react';
import Navbar from "../../components/Navbar.js"
import Footer from "../../components/Footer.js"
import List from "../../components/List.js"
import * as Icon from 'react-feather';
import classNames from "classnames";
import AsyncSelect from 'react-select/async';
import { useRouter } from 'next/router'
import * as common from '../../commonClient.js'


export default function playlist() {
    const router = useRouter()
    const [playlist, setPlaylist] = useState({ name: "new", songs: [] });
    const [songs, setSongs] = useState([]);

    const [filterTimeoutState, setfilterTimeoutState] = useState('')
    const [editMode, setEditMode] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [editable, setEditable] = useState(true);
    

    useEffect(() => {
        console.log('useEffect');
        getPlaylist()
    }, [])

    const getPlaylist = async () => {
        setSpinner(true)
        const _id = window.location.pathname.replace('/playlists/', '')
        const res = await fetch('/api/getPlaylist?_id=' + _id)
        const resJson = await res.json()
        setSpinner(false)


        if (res.status !== 200) {
            console.log(resJson);
            return
        }

        if(resJson.playlist.user != common.userId()) {
            console.log('!');
            setEditable(false)
        }

        setPlaylist(resJson.playlist)
        setSongs(resJson.songs)
    }

    const edit = async () => {
        setSpinner(true)
        //const common = (await import('../../commonClient.js'))
        let authorized = await common.checkAuth()
        const userId = common.userId()
        setPlaylist({
            ...playlist,
            user: userId
        })
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
        let resJson = await response.json()

        if (response.status === 200) {
            setPlaylist(resJson.playlist)
            setEditMode(false)
            router.push("/playlists/" + resJson.playlist._id)
        }

        if (response.status !== 200) {
            console.log(resJson);
        }

        e.target.disabled = false
        setSpinner(false)

    }

    return (
        <div className="bg-black vh-100">
            <Navbar logo='Home' />

            <div className='row m-3'>
                <div className={classNames('col-auto', { 'd-none': !editable })}>
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
                onSelect={(e) => {
                    console.log('onSelectSong');
                    const arrindex = e.target.attributes['arrindex'].value
                    let newSongs = [...songs]
                    newSongs[arrindex].selected = true
                    setSongs(newSongs)
                }}
                onChangeName={(e) => {
                    console.log('onChangeName');
                    setPlaylist({
                        ...playlist,
                        name: e.target.value
                    })
                }}
                onRemoveFromList={(e) => {
                    console.log('onRemoveFromList');
                    const arrindex = e.target.attributes['arrindex'].value
                    let newSongs = [...songs]
                    newSongs.splice(arrindex, 1)
                    setSongs(newSongs)
                }}
                editMode={editMode}
            />

            <AsyncSelect
                id="long-value-select"
                instanceId="long-value-select"
                className={classNames("text-dark", "m-3", { 'd-none': !editMode })}
                defaultOptions={[]}
                loadOptions={(inputValue, callback) => {
                    // setTimeout for debounce
                    clearTimeout(filterTimeoutState)
                    setfilterTimeoutState(setTimeout(() => {
                        console.log('loadOptions');
                        fetch('/api/getSongs?name=' + inputValue)
                            .then((res) => res.json())
                            .then((resJson) => callback(resJson.songs))
                    }, 500))
                }}
                placeholder='Add song'
                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                onChange={(selectedValue) => {
                    console.log('onChange');
                    setPlaylist({
                        ...playlist,
                        songs: [...playlist.songs, selectedValue._id]
                    })
                    setSongs([...songs, {
                        label: selectedValue.label,
                        value: '/songs/' + selectedValue.value
                    }])
                }}
            />


            <Footer />
        </div>
    )
}
