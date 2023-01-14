import Navbar from "../../components/Navbar.js"
import Footer from "../../components/Footer.js"
import Chords from "../../components/Chords.js"
import { MongoClient } from 'mongodb'

function songs(props) {

    const songs = JSON.parse(props.songs)

    return (
        <div className="bg-black">
            <Navbar logo="Best chords" />
            <Chords songs={songs} />
            <Footer />
        </div>
    )
}

export default songs

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
        .find({})
        .sort({ name: 1 })
        .toArray();

    let result = []
    if (songs.length > 0) result = songs

    return {
        props: { 'songs': JSON.stringify(songs) },
    }
}