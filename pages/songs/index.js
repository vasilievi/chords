import Navbar from "../../components/Navbar.js"
import Footer from "../../components/Footer.js"
import List from "../../components/List.js"
import { MongoClient } from 'mongodb'
import { useRouter } from 'next/router'


function songs(props) {
    const songs = JSON.parse(props.songs)
    const router = useRouter()

    const onSelectSong = (e) => {
        router.push('/songs/' + e.target.attributes['value'].value)
    }

    return (
        <div className="bg-black">
            <Navbar logo="Best chords" />
            <List name='All songs' list={songs} onSelectSong={onSelectSong} />
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
    if (songs.length > 0) {
        for (const song of songs) {
            result.push({ label: song.name, value: song.url })
        }
    }

    return {
        props: { 'songs': JSON.stringify(result) },
    }
}