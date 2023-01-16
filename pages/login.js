import Navbar from "../components/Navbar.js"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import Router from "next/router";
import classNames from "classnames";

export default function login(props) {
    const router = useRouter();

    const [user, setUser] = useState({
        phonenumber: '',
        code: ''
    });
    const [spinner, setSpinner] = useState(false);


    useEffect(() => {
        if (user.code.length === 4) checkAuth()
    }, [user.code])

    const [codeSent, setCodeSent] = useState(false)

    const auth = async () => {
        console.log('auth');
        setSpinner(true)

        let res = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        });

        console.log(res.status);

        if (res.status === 200) {
            setCodeSent(true)
        }
        setSpinner(false)

    }

    const checkAuth = async () => {
        console.log('checkAuth');
        localStorage.setItem('user', JSON.stringify(user))
        setSpinner(true)
        const common = (await import('../common.js'))
        let authorized = await common.checkAuth()
        setSpinner(false)

        if (authorized) {
            router.push('/')
        }
    }

    Router.events.on("routeChangeStart", () => {
        setSpinner(true)
    });


    return (
        <div className="bg-black">
            <Navbar logo="Best chords" />
            <main className="d-flex w-100">
                <div className="container d-flex flex-column">
                    <div className="row vh-100">
                        <div className="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
                            <div className="d-table-cell align-middle">
                                <div className="card bg-black">
                                    <div className="card-body">
                                        <div className="m-sm-4">
                                            <div className="text-center">
                                                <h1 className="h2 bg-black text-white">Login</h1>
                                                <div
                                                    className={classNames('spinner-grow', 'text-light', { 'd-none': !spinner })}
                                                    role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>

                                            </div>
                                            <form>
                                                <div
                                                    className={classNames('mb-3', 'row', { 'd-none': codeSent })}>
                                                    <label className="form-label bg-black text-white">Phone number</label>
                                                    <div className="col-8">
                                                        <input className="form-control" type="number"
                                                            placeholder="9876543210"
                                                            max="9999999999"
                                                            value={user.phonenumber}
                                                            disabled={spinner}
                                                            onChange={(e) => {
                                                                setUser({ ...user, phonenumber: e.target.value })
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    auth();
                                                                }
                                                            }} />
                                                    </div>
                                                    <div className="col-4">
                                                        <button type="button" className="btn btn-outline-warning"
                                                            onClick={auth}
                                                            disabled={spinner}
                                                        >Get code</button>
                                                    </div>
                                                </div>
                                                <div
                                                    className={classNames('mb-3', 'row', { 'd-none': !codeSent })}>
                                                    <label className="form-label bg-black text-white">Code</label>
                                                    <div className="col">
                                                        <input className="form-control" type="number"
                                                            placeholder="1234"
                                                            max="9999"
                                                            disabled={spinner}
                                                            value={user.code}
                                                            onChange={(e) => {
                                                                setUser({ ...user, code: e.target.value })
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

