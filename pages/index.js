import Navbar from "../components/Navbar.js"
import Footer from "../components/Footer.js"
import Carousel from "../components/Carousel.js"

function homePage(props) {

    return (
        <div className="bg-black  vh-100">
            <Navbar logo="Best chords" />
            <Carousel />
            <Footer />
        </div>
    )
}

export default homePage
