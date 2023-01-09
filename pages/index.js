import Navbar from "../components/Navbar.js"
import Footer from "../components/Footer.js"
import Carousel from "../components/Carousel.js"
import Link from 'next/link'
import { MongoClient } from 'mongodb'


function homePage(props) {

    const songs = JSON.parse(props.songs)

    return (
        <div className="bg-black">
            <Navbar logo="Best chords" />
            <Carousel />

            <ul className="list-group">
                {songs.map((song, index) => (
                    <li key={index} className="list-group-item bg-black">
                        <div className="row">
                            <div className="col-9">
                                <Link
                                    className="text-white no-underline"
                                    href={"/songs/" + song.url}
                                    spinner-id={"spinner-" + index}
                                    onClick={(e) => {
                                        console.log(e.target);
                                        const spinner = document.getElementById(e.target.attributes['spinner-id'].value)
                                        spinner.style.display=''
                                    }}>{song.name}</Link>
                            </div>
                            <div className="col-3">
                                <div
                                    id={"spinner-" + index}
                                    className="spinner-grow text-light"
                                    role="status"
                                    style={{"display": "none"}}>
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <Footer />
        </div>
    )
}

export default homePage

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