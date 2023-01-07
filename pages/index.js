import Navbar from "../components/Navbar.js"
import Carousel from "../components/Carousel.js"
import Link from 'next/link'
import { MongoClient } from 'mongodb'
import { useState } from 'react';


function homePage(props) {

    const [spinner, setSpinner] = useState(false);
    const songs = JSON.parse(props.songs)

    return (
        <div className="bg-black">
            <Navbar />
            <Carousel />

            <ul className="list-group">
                {songs.map((song, index) => (
                    <li key={index} className="list-group-item bg-black">
                        <div className="row">
                            <div className="col">
                                <Link
                                    className="text-white"
                                    href={"/songs/" + song.url}
                                    onClick={() => {
                                        setSpinner(true)
                                    }}>{song.name}</Link>
                            </div>
                            <div className="col">
                                <div
                                    style={{ display: (spinner) ? "" : "none" }}
                                    className="spinner-grow text-light"
                                    role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
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
        .sort({ name: -1 })
        .toArray();

    let result = []
    if (songs.length > 0) result = songs

    return {
        props: { 'songs': JSON.stringify(songs) },
    }
}