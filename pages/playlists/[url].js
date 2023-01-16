import classNames from "classnames";
import { useState } from 'react';
import { MongoClient } from 'mongodb'
import { ObjectId, MongoClient } from 'mongodb'


// Client
export default function playlist(props) {

  let propPlaylist = JSON.parse(props.song)
  const [playlist, setPlaylist] = useState(propPlaylist);


  return (
    <div className="bg-black">
      <Navbar logo='Home' />

      <div className="m-3">
        {/* Header */}
        <textarea
          className="form-control font-monospace form-control-lg bg-black text-warning mb-3"
          disabled={(editMode) ? false : true}
          value={playlist.name}
          onChange={(e) => {
            let translit = transliterate(e.target.value).toLowerCase();
            console.log(translit);
            setPlaylist({
              ...playlist,
              name: e.target.value
            })
          }}></textarea>

        {/* Buttons */}
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
    .collection("playlists")
    .find({ _id: context.params.url })
    .toArray();

  let result = { url: context.params.url, name: 'new', text: 'new', key: 'C' }
  if (songs.length > 0) {
    result = songs[0]
    // delete result._id
  }

  return {
    props: { 'song': JSON.stringify(result) },
  }
}
