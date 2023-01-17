import Link from 'next/link'
import Router from "next/router";
import { useRouter } from 'next/navigation'
import AsyncSelect from 'react-select/async';
import * as Icon from 'react-feather';
import { useState, useEffect } from 'react';
import classNames from "classnames";

export default function Navbar(props) {
    const router = useRouter();
    const [spinner, setSpinner] = useState(false);
    const [filterTimeoutState, setfilterTimeoutState] = useState('')
    const [authorized, setauthorized] = useState(false)
    const [phonenumber, setPhonenumber] = useState('')

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        if(user) setPhonenumber(user.phonenumber)
        import('../commonClient.js')
            .then((common) => common.checkAuth())
            .then((res) => setauthorized(res))
    }, [])

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
        setSpinner(true)

        const closeCanvasButton = document.getElementById('close-canvas-button')
        closeCanvasButton.click()
    };

    const end = () => {
        setSpinner(false)
    };

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);

    return (
        <div>
            <nav className="navbar navbar-dark bg-dark fixed-top">
                <div className="container-fluid">
                    <Link
                        href="/"
                        className={classNames('text-white', 'no-underline', { 'd-none': spinner })}
                    >{props.logo}
                    </Link>

                    <div
                        className={classNames('spinner-grow', 'text-light', { 'd-none': !spinner })}
                        role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>

                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="offcanvas offcanvas-end text-bg-dark" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">Best chords</h5>
                            <button id='close-canvas-button' type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                                <li className="nav-item">
                                    <div className='m-3 h6 text-center text-warning'>{phonenumber}</div>
                                </li>
                                <li className="nav-item">
                                    <AsyncSelect
                                        id="long-value-select"
                                        instanceId="long-value-select"
                                        className='text-dark'
                                        defaultOptions={[]}
                                        loadOptions={loadOptions}
                                        placeholder='Search'
                                        components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                        onChange={(selectedValue) => {
                                            console.log('onChange');
                                            router.push('/songs/' + selectedValue.value)
                                        }}
                                    />
                                </li>
                                <li className="nav-item">
                                    <Link
                                        href="/songs"
                                        className="nav-link text-white no-underline"
                                    >
                                        <div className='row'>
                                            <div className='col-auto'><Icon.Music /></div>
                                            <div className='col-auto'>All songs</div>
                                        </div>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        href="/login"
                                        className={classNames('nav-link', 'text-white', { 'd-none': authorized })}>
                                        <div className='row'>
                                            <div className='col-auto'><Icon.LogIn /></div>
                                            <div className='col-auto'>Login</div>
                                        </div>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        href="/playlists"
                                        className={classNames('nav-link', 'text-white', { 'd-none': !authorized })}
                                    >
                                        <div className='row'>
                                            <div className='col-auto'><Icon.List /></div>
                                            <div className='col-auto'>My playlists</div>
                                        </div>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        href="/logout"
                                        className={classNames('nav-link', 'text-white', { 'd-none': !authorized })}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            localStorage.removeItem('user')
                                            router.push('/login')
                                        }}>
                                        <div className='row'>
                                            <div className='col-auto'><Icon.LogOut /></div>
                                            <div className='col-auto'>Logout</div>
                                        </div>
                                    </Link>
                                </li>
                            </ul>

                        </div>
                    </div>
                </div>
            </nav >
            <div style={{ "height": "60px" }}></div>
        </div >


    )
}
