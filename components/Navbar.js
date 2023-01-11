import Link from 'next/link'
import Router from "next/router";
import { useRouter } from 'next/navigation'
import { useState } from 'react';
import AsyncSelect from 'react-select/async';


export default function Navbar(props) {
    const router = useRouter();
    const [spinner, setSpinner] = useState(false);
    const [filterTimeoutState, setfilterTimeoutState] = useState('')


    let defaultOptions = []

    const loadOptions = (inputValue, callback) => {
        // setTimeout for debounce
        clearTimeout(filterTimeoutState)
        setfilterTimeoutState(setTimeout(() => {
            console.log('loadOptions');
            fetch('/api/getSongs?name=' + inputValue)
                .then((res) => res.json())
                .then((resJson) => callback(resJson.songs))
        }, 500))
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
        // <div className='p-3'>
        //     <div className="row">
        //         <div className='col-3' style={{ display: (spinner) ? "none" : "" }}>
        // <Link
        //     href="/"
        //     className="text-white no-underline">{props.logo}
        // </Link>
        //         </div>

        //         <div className='col-3' style={{ display: (spinner) ? "" : "none" }}>
        // <div
        //     className="spinner-grow text-light"
        //     role="status">
        //     <span className="visually-hidden">Loading...</span>
        // </div>
        //         </div>

        //         <div className='col-9'>
        //             <AsyncSelect
        //                 defaultOptions={defaultOptions}
        //                 loadOptions={loadOptions}
        //                 placeholder='Search'
        //                 components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
        //                 onChange={(selectedValue) => {
        //                     console.log('onChange');
        //                     router.push('/songs/' + selectedValue.value)
        //                 }}
        //             />
        //         </div>

        //     </div>
        // </div>

        <nav className="navbar navbar-dark bg-dark fixed-top">
            <div className="container-fluid">
                <Link
                    style={{ display: (spinner) ? "none" : "" }}
                    href="/"
                    className="text-white no-underline">{props.logo}
                </Link>

                <div
                    style={{ display: (spinner) ? "" : "none" }}
                    className="spinner-grow text-light"
                    role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>

                <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="offcanvas offcanvas-end text-bg-dark" tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">Dark offcanvas</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Link</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Dropdown
                                </a>
                                <ul className="dropdown-menu dropdown-menu-dark">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
                        </ul>
                        <AsyncSelect
                            defaultOptions={defaultOptions}
                            loadOptions={loadOptions}
                            placeholder='Search'
                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                            onChange={(selectedValue) => {
                                console.log('onChange');
                                router.push('/songs/' + selectedValue.value)
                            }}
                        />
                    </div>
                </div>
            </div>
        </nav>
    )
}
