import Navbar from "../../components/Navbar.js"
import Footer from "../../components/Footer.js"
import List from "../../components/List.js"
import { MongoClient } from 'mongodb'
import { useRouter } from 'next/router'


export default function playlists(props) {
    const playlists = JSON.parse(props.playlists)
    const router = useRouter()

    const onSelectPlaylist = (e) => {
        router.push('/playlists/' + e.target.attributes['value'].value)
    }

    return (
        <div className="bg-black vh-100">
            <Navbar logo="Best chords" />
            <List name='Playlists' list={playlists} onSelect={onSelectPlaylist} />
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

    const playlists = await db
        .collection("playlists")
        .find({})
        .sort({ name: 1 })
        .toArray();

    let result = []
    if (playlists.length > 0) {
        for (const playlist of playlists) {
            result.push({ label: playlist.name, value: playlist._id })
        }
    }

    return {
        props: { 'playlists': JSON.stringify(result) },
    }
}