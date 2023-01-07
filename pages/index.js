import Carousel from "../components/Carousel.js"
import Link from 'next/link'

function homePage(params) {

    return (
        <div className="bg-black">
            <h1 className="text-white display-3 text-center">Chords</h1>
            <Carousel />

            <ul className="list-group">
                <li className="list-group-item bg-black">
                    <Link className="text-white" href="/songs/bocelli-champagne">Andrea Bocelli - Champagne</Link>
                </li>
            </ul>
        </div>
    )
}

export default homePage