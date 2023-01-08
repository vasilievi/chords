import { useState, useEffect } from 'react';
import { transpose } from 'chord-transposer';
import { useRouter } from 'next/router'
import { MongoClient } from 'mongodb'
import Navbar from "../../components/Navbar.js"
import Footer from "../../components/Footer.js"
import * as Icon from 'react-feather';

// Client
export default function Song(props) {

  const router = useRouter()
  const { url } = router.query
  const [editMode, setEditMode] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  const [song, setSong] = useState({ name: '', text: '' });

  useEffect(() => {
    console.log('useEffect');
    setSong(JSON.parse(props.song))

    setTimeout(() => {
      autoHeight()
    }, 500);
  }, [props.song])

  const autoHeight = () => {
    console.log('autoHeight');
    let textarea = document.getElementById('textarea')
    textarea.setAttribute("style", "height:" + (textarea.scrollHeight) + "px;overflow-y:hidden;");
  }

  const transposeUp = () => {
    setSong({ ...song, text: transpose(text).up(1).toString() })
  }

  const transposeDown = () => {
    setSong({ ...song, text: transpose(text).down(1).toString() })
  }

  const edit = () => {
    setEditMode(true)
  }

  const save = async (e) => {

    e.target.disabled = true
    setSpinner(true)

    let response = await fetch('/api/postSong', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        url: url,
        name: song.name,
        text: song.text
      })
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
      <Navbar />

      <div className="m-3">
        {/* Header */}
        <textarea
          className="form-control font-monospace form-control-lg bg-black text-warning mb-3"
          disabled={(editMode) ? false : true}
          value={song.name}
          onChange={(e) => {
            setSong({ ...song, name: e.target.value })
          }}></textarea>

        {/* Buttons */}
        <div className='row mb-3'>
          <div className='col'>
            <div className='btn-group'>
              <button className='btn btn-outline-light' onClick={transposeUp}><Icon.Plus /></button>

              <button className='btn btn-outline-light' onClick={transposeDown}><Icon.Minus /></button>

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
          <div className='col'>
            <div
              style={{ display: (spinner) ? "" : "none" }}
              className="spinner-grow text-light"
              role="status">
              <span className="visually-hidden">Loading...</span>
            </div>

          </div>
        </div>

        {/* Text */}
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

  let result = { text: 'not found' }
  if (songs.length > 0) result = songs[0]

  return {
    props: { 'song': JSON.stringify(result) },
  }
}