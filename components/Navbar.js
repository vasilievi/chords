import Link from 'next/link'
import Router from "next/router";
import { useRouter } from 'next/navigation'
import { useState } from 'react';
import AsyncSelect from 'react-select/async';


export default function Navbar(props) {
    const router = useRouter();
    const [spinner, setSpinner] = useState(false);

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
                <div className='col-3' style={{ display: (spinner) ? "none" : "" }}>
                    <Link
                        href="/"
                        className="text-white no-underline">{props.logo}
                    </Link>
                </div>

                <div className='col-3' style={{ display: (spinner) ? "" : "none" }}>
                    <div
                        className="spinner-grow text-light"
                        role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>

                <div className='col-9'>
                    <AsyncSelect
                        defaultOptions={defaultOptions}
                        loadOptions={loadOptions}
                        placeholder='Search'
                        components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                        onChange={(selectedValue) => {
                            console.log('onChange');
                            router.push('/songs/'+selectedValue.value)
                        }}
                    />
                </div>

            </div>
        </div>
    )
}
