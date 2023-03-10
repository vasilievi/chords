import Navbar from "../components/Navbar.js"
import Footer from "../components/Footer.js"
import Carousel from "../components/Carousel.js"
import Link from 'next/link'
import Head from 'next/head'


export default function homePage() {

    return (
        <div className="bg-black  vh-100">
            <Head>
                <meta name="yandex-verification" content="ed4a5645e0e5c7d8" />
            </Head>
            <Navbar logo="Best chords" />
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
