import { useState, useEffect } from 'react';
import { transpose } from 'chord-transposer';
import Router from "next/router";
import { useRouter } from 'next/router'
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

  var a = {
    "Ё": "yo", "Й": "i", "Ц": "ts", "У": "u", "К": "k", "Е": "e",
    "Н": "n", "Г": "g", "Ш": "sh", "Щ": "sh", "З": "z", "Х": "h",
    "Ъ": "'", "ё": "yo", "й": "i", "ц": "ts", "у": "u", "к": "k",
    "е": "e", "н": "n", "г": "g", "ш": "sh", "щ": "sch", "з": "z",
    "х": "h", "ъ": "'", "Ф": "f", "Ы": "i", "В": "v", "А": "a", "П": "p",
    "Р": "r", "О": "o", "Л": "l", "Д": "d", "Ж": "zh", "Э": "e",
    "ф": "f", "ы": "i", "в": "v", "а": "a", "п": "p", "р": "r", "о": "o",
    "л": "l", "д": "d", "ж": "zh", "э": "e", "Я": "ya", "Ч": "ch",
    "С": "s", "М": "m", "И": "i", "Т": "t", "Ь": "/", "Б": "B", "Ю": "YU",
    "я": "ya", "ч": "ch", "с": "s", "м": "m", "и": "i", "т": "t", "ь": "'",
    "б": "b", "ю": "yu", " ": "-"
  };

  function transliterate(word) {
    return word.split('').map(function (char) {
      return a[char] || char;
    }).join("");
  }

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
    const common = (await import('../../commonClient.js'))
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
    console.log('save');
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

    if(!song._id) router.push('/songs/' + song.url)
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
            let translit = transliterate(e.target.value).toLowerCase();
            console.log(translit);
            setSong({
              ...song,
              name: e.target.value,
              url: translit
            })
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
import dbConnect from '../../lib/dbConnect'
import Song from '../../models/Song'

export async function getServerSideProps(context) {

  await dbConnect()
  const song = await Song.findOne({ url: context.params.url })

  let result = { url: context.params.url, name: 'new', text: 'new', key: 'C' }
  if (song) {
    result = song
  }

  return {
    props: { 'song': JSON.stringify(result) },
  }
}
