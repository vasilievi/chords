import { useState, useEffect } from 'react';
import { transpose } from 'chord-transposer';
import { useRouter } from 'next/router'
import { MongoClient } from 'mongodb'
import Navbar from "../../components/Navbar.js"



// Client
export default function Song(props) {

  const router = useRouter()
  const { url } = router.query
  const song = JSON.parse(props.song)

  const [text, setText] = useState(song.text);
  const [name, setName] = useState(song.name);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    console.log('useEffect');
    let textarea = document.getElementById('textarea')
    textarea.style.height = (window.innerHeight - 160).toString() + "px"
  }, [])

  const transposeUp = () => {
    setText(transpose(text).up(1).toString());
  }

  const transposeDown = () => {
    setText(transpose(text).down(1).toString());
  }

  const edit = () => {
    setEditMode(true)
  }

  const save = () => {
    setEditMode(false)
  }

  return (
    <div className="bg-black text-white p-3">
      <Navbar />
      <input className="display-3 bg-black text-white"
        value={name}
        onChange={(e) => {
          setName(e.target.value)
        }} 
        disabled={!editMode}/>


      <div className='row mb-3'>
        <div className='col' style={{ display: (editMode) ? "none" : "" }}>
          <div className='btn-group'>
            <button className='btn btn-outline-light' onClick={transposeUp}>+</button>
            <button className='btn btn-outline-light' onClick={transposeDown}>-</button>
            <button className='btn btn-outline-light' onClick={transposeDown}>Reset</button>
          </div>
        </div>
        <div className='col'>
          <button
            className='btn btn-outline-light'
            onClick={edit}
            style={{ display: (editMode) ? "none" : "" }}
          >Edit</button>
          <button className='btn btn-outline-warning'
            onClick={save}
            style={{ display: (editMode) ? "" : "none" }}
          >Save</button>
        </div>
      </div>
      <textarea
        id='textarea'
        className="form-control font-monospace form-control-lg bg-black text-white"
        disabled={(editMode) ? false : true}
        value={text}
        onChange={(e) => {
          setText(e.target.value)
        }}></textarea>
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