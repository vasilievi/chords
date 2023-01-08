import Link from 'next/link'
import Router from "next/router";
import { useState } from 'react';
import AsyncSelect from 'react-select/async';


export default function Navbar(props) {
    const [spinner, setSpinner] = useState(false);
    const [search, setSearch] = useState('');

    let defaultOptions = []

    const loadOptions = async (inputValue) => {
        console.log('loadOptions');

        let response = await fetch('/api/getSongs?name=' + inputValue)
        let result = await response.json()
        return result.songs
    }

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
        <div className='p-3'>
            <div className="row">
                <div className='col'>
                    <Link
                        href="/"
                        className="text-white no-underline">Chords
                    </Link>
                </div>

                <div className='col'>
                    <div
                        style={{ display: (spinner) ? "" : "none" }}
                        className="spinner-grow text-light"
                        role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>

                <div className='col'>
                    <AsyncSelect
                        defaultOptions={defaultOptions}
                        loadOptions={loadOptions}
                        placeholder='Search'
                        components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                        value={search}
                        onChange={(value) => {
                            setSearch(value)
                            
                        }}
                    />
                </div>

            </div>
        </div>
    )
}
