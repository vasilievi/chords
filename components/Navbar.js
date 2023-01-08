import Link from 'next/link'
import Router from "next/router";
import { useState } from 'react';


export default function Navbar(props) {
    const [spinner, setSpinner] = useState(false);

    const start = () => {
        console.log("start");
        setSpinner(true)
    };

    const end = () => {
        console.log("finished");
        setSpinner(false)
    };

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);

    return (
        <nav className="navbar navbar-dark bg-black">
            <div className="container-fluid">
                <Link
                    href="/"
                    className="text-white no-underline">Chords
                </Link>

                <div
                    style={{ display: (spinner) ? "" : "none" }}
                    className="spinner-grow text-light"
                    role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>

            </div>
        </nav>
    )
}
