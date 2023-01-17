import { ObjectId } from 'mongodb'

export default function playlist(props) {

    let playlist = JSON.parse(props.playlist)

    return (
        <h1>{playlist.name}</h1>
    )
}

// Server
export async function getServerSideProps(context) {

    const commonServer = (await import('../../commonServer.js'))
    let mongoConnection = await commonServer.mongoConnection()

    const db = mongoConnection.db("chords");

    playlist = await db
        .collection("playlists")
        .findOne({ _id: ObjectId(context.params.url) })

    let result = {name: 'New'}
    if (playlist) result = playlist

    return {
        props: { 'playlist': JSON.stringify(playlist) },
    }
}