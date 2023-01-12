import Navbar from "../components/Navbar.js"
import { useState } from 'react';

export default function login(props) {

    const [user, setUser] = useState({
        phonenumber: '',
        code: ''
    });

    const [codeSent, setCodeSent] = useState(false)
    const [confirmed, setConfirmed] = useState(false)

    const getCode = async () => {
        console.log('getCode');
        let response = await fetch('/api/getCode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        });

        if (response.status === 200) {
            setCodeSent(true)
        }
    }

    const confirm = async () => {
        console.log('confirm');
        let response = await fetch('/api/confirm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        });

        if (response.status === 200) {
            setConfirmed(true)
        }
    }

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
                                            </div>
                                            <form>
                                                <div className="mb-3 row">
                                                    <label className="form-label bg-black text-white">Phone number</label>
                                                    <div className="col-auto">
                                                        <input className="form-control" type="number"
                                                            placeholder="9876543210"
                                                            max="9999999999"
                                                            disabled={codeSent}
                                                            value={user.phonenumber}
                                                            onChange={(e) => {
                                                                setUser({ ...user, phonenumber: e.target.value })
                                                            }} />
                                                    </div>
                                                    <div className="col-auto">
                                                        <button type="button" className="btn btn-outline-warning"
                                                            disabled={codeSent}
                                                            onClick={getCode}
                                                        >Get code</button>
                                                    </div>
                                                </div>
                                                <div className="mb-3 row">
                                                    <label className="form-label bg-black text-white">Code</label>
                                                    <div className="col-auto">
                                                        <input className="form-control" type="number"
                                                            placeholder="1234"
                                                            max="9999"
                                                            disabled={confirmed}
                                                            value={user.code}
                                                            onChange={(e) => {
                                                                setUser({ ...user, code: e.target.value })
                                                            }} />
                                                    </div>
                                                    <div className="col-auto">
                                                        <button type="button" className="btn btn-outline-warning"
                                                            disabled={confirmed}
                                                            onClick={confirm}>Confirm</button>
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

