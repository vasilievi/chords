import { useState, useEffect } from 'react';
import { transpose } from 'chord-transposer';
import { useRouter } from 'next/router'
import { MongoClient } from 'mongodb'
import Navbar from "../../components/Navbar.js"
import Footer from "../../components/Footer.js"
import HighlightText from "../../components/HighlightText"
import * as Icon from 'react-feather';

// Client
export default function Song(props) {

  const router = useRouter()
  const [editMode, setEditMode] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  let propSong = JSON.parse(props.song)
  const [song, setSong] = useState(propSong);

  useEffect(() => {
    setSong(JSON.parse(props.song))
  }, [props.song])

  const autoHeight = () => {
    let textarea = document.getElementById('textarea')
    textarea.setAttribute("style", "height:" + (textarea.scrollHeight) + "px;overflow-y:hidden;");
  }

  const transposeUp = () => {
    setSong({ ...song, text: transpose(song.text).up(1).toString() })
  }

  const transposeReset = () => {
    setSong({ ...song, text: transpose(song.text).toKey(song.key).toString() })
  }

  const transposeDown = () => {
    setSong({ ...song, text: transpose(song.text).down(1).toString() })
  }

  const edit = () => {
    setEditMode(true)

    setTimeout(() => {
      autoHeight()
    }, 500);
  }

  const save = async (e) => {
    e.target.disabled = true
    setSpinner(true)

    let response = await fetch('/api/postSong', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(song)
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

  const startScroll = () => {
    setScrolling(true)
    const timerId = setInterval(() => {
      console.log('scrolling');
      window.scrollTo(0, document.documentElement.scrollTop + 10);
    }, 1000);
    localStorage.setItem('timerId', timerId)
  }

  const stopScroll = () => {
    const timerId = localStorage.getItem('timerId')
    clearInterval(timerId)
    setScrolling(false)
  }

  return (
    <div className="bg-black">
      <Navbar logo='Home' />

      <div className="m-3">
        {/* Header */}
        <textarea
          className="form-control font-monospace form-control-lg bg-black text-warning mb-3"
          disabled={(editMode) ? false : true}
          value={song.name}
          onChange={(e) => {
            setSong({ ...song, name: e.target.value })
          }}></textarea>

        <div className='row mb-3'>
          <div className="col-auto">
            <label className="col-form-label bg-black text-white">Key</label>
          </div>
          <div className="col-auto">
            <input
              disabled={(editMode) ? false : true}
              size="4"
              className="form-control bg-black text-white"
              value={song.key}
              onChange={(e) => {
                setSong({ ...song, key: e.target.value })
              }}
            />
          </div>
          <div className="col-auto">
            <div className='btn-group'>
              <button className='btn btn-outline-light' onClick={transposeUp}><Icon.Plus /></button>
              <button className='btn btn-outline-light' onClick={transposeReset}>Reset</button>
              <button className='btn btn-outline-light' onClick={transposeDown}><Icon.Minus /></button>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className='row mb-3'>
          <div className='col-auto'>
            <div className='btn-group'>
              <button className='btn btn-outline-light'
                onClick={startScroll}
                style={{ display: (scrolling) ? "none" : "" }}><Icon.PlayCircle /></button>

              <button className='btn btn-outline-warning'
                onClick={stopScroll}
                style={{ display: (scrolling) ? "" : "none" }}><Icon.StopCircle /></button>

              <button className='btn btn-outline-warning'
                onClick={save}
                style={{ display: (editMode) ? "" : "none" }}
              >Save</button>

              <button
                className='btn btn-outline-light'
                onClick={edit}
                style={{ display: (editMode) ? "none" : "" }}
              ><Icon.Edit /></button>
            </div>
          </div>
          <div className='col-auto'>
            <div
              style={{ display: (spinner) ? "" : "none" }}
              className="spinner-grow text-light"
              role="status">
              <span className="visually-hidden">Loading...</span>
            </div>

          </div>
        </div>

        {/* Text */}
        <div
          style={{ display: (editMode) ? "" : "none" }}
        >
          <textarea
            id='textarea'
            className="form-control font-monospace form-control-lg bg-black text-white mb-3"
            disabled={(editMode) ? false : true}
            value={song.text}
            onChange={(e) => {
              setSong({ ...song, text: e.target.value })
              autoHeight()
            }}></textarea>
        </div>

        <HighlightText
          text={song.text}
          visible={!editMode}
        />

      </div>

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
    .find({ url: context.params.url })
    .toArray();

  let result = { url: context.params.url, name: 'not found', text: 'not found', key: '' }
  if (songs.length > 0) {
    result = songs[0]
    delete result._id
  }

  return {
    props: { 'song': JSON.stringify(result) },
  }
}
