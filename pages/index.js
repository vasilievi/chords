import Navbar from "../components/Navbar.js"
import Footer from "../components/Footer.js"
import Carousel from "../components/Carousel.js"
import Link from 'next/link'
import Head from 'next/head'


export default function homePage() {

    return (
        <div className="bg-black  vh-100">
            <Head>
                <title>Best guitar chords</title>
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <meta name="description" content={'Worlds best songs with lyrics and chords. Autoscroll chords and play video at the same time.'}></meta>
            </Head>
            <Navbar logo="Songs" url='/songs' />
            <Carousel />
            <div className="bg-black d-flex justify-content-center">
                <Link
                    className='h1 text-warning text-center m-3 no-underline'
                    href={'/songs'}>
                    Let's play!
                </Link>
            </div>
            <Footer />
        </div>
    )
}
