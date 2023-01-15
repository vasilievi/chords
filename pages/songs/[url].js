import { useState, useEffect } from 'react';
import { transpose } from 'chord-transposer';
import Router from "next/router";
import { useRouter } from 'next/router'
import { MongoClient } from 'mongodb'
import Navbar from "../../components/Navbar.js"
import Footer from "../../components/Footer.js"
import HighlightText from "../../components/HighlightText"
import * as Icon from 'react-feather';
import classNames from "classnames";


// Client
export default function song(props) {

  const router = useRouter()
  const [editMode, setEditMode] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  let propSong = JSON.parse(props.song)
  const [song, setSong] = useState(propSong);

  useEffect(() => {
    setSong(JSON.parse(props.song))
  }, [props.song])

  Router.events.on("routeChangeStart", () => {
    stopScroll()
  });

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

  const edit = async () => {
    setSpinner(true)
    const common = (await import('../../common.js'))
    let authorized = await common.checkAuth()
    setSpinner(false)

    if (authorized) {
      setEditMode(true)
      setTimeout(() => {
        autoHeight()
      }, 500);
    } else {
      router.push('/login')
    }
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

        {/* Buttons */}
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

        <div className='row mb-3'>
          <div className='col-auto'>
            <div className='btn-group'>
              <button
                className={classNames('btn', 'btn-outline-light', { 'd-none': scrolling })}
                onClick={startScroll}><Icon.PlayCircle /></button>

              <button
                className={classNames('btn', 'btn-outline-warning', { 'd-none': !scrolling })}
                onClick={stopScroll}><Icon.StopCircle /></button>

              <button
                className={classNames('btn', 'btn-outline-warning', { 'd-none': !editMode })}
                onClick={save}
              >Save</button>

              <button
                className={classNames('btn', 'btn-outline-light', { 'd-none': editMode })}
                onClick={edit}
              ><Icon.Edit /></button>
            </div>
          </div>
          <div className='col-auto'>
            <div
              className={classNames("spinner-grow", "text-light", { 'd-none': !spinner })}
              role="status">
              <span className="visually-hidden">Loading...</span>
            </div>

          </div>
        </div>

        {/* Text Edit */}
        <div
          className={classNames({ 'd-none': !editMode })}
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

        {/* Text View */}
        <div
          className={classNames({ 'd-none': editMode })}
        >
          <HighlightText
            text={song.text}
          />
        </div>

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
