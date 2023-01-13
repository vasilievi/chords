import Navbar from "../components/Navbar.js"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'

export default function login(props) {
    const router = useRouter();

    const [user, setUser] = useState({
        phonenumber: '',
        code: ''
    });

    useEffect(() => {
        if(user.code.length === 4) checkAuth()
      }, [user.code])

    const [codeSent, setCodeSent] = useState(false)

    const auth = async () => {
        console.log('auth');
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
    }

    const checkAuth = async () => {
        console.log('checkAuth');
        let response = await fetch('/api/checkAuth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        });

        if (response.status === 200) {
            localStorage.setItem('user', JSON.stringify(user))
            router.push('/')
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
                                                    <div className="col-8">
                                                        <input className="form-control" type="number"
                                                            placeholder="79876543210"
                                                            max="79999999999"
                                                            disabled={codeSent}
                                                            value={user.phonenumber}
                                                            onChange={(e) => {
                                                                setUser({ ...user, phonenumber: e.target.value })
                                                            }} />
                                                    </div>
                                                    <div className="col-4">
                                                        <button type="button" className="btn btn-outline-warning"
                                                            disabled={codeSent}
                                                            onClick={auth}
                                                        >Get code</button>
                                                    </div>
                                                </div>
                                                <div className="mb-3 row">
                                                    <label className="form-label bg-black text-white">Code</label>
                                                    <div className="col-8">
                                                        <input className="form-control" type="number"
                                                            placeholder="1234"
                                                            max="9999"
                                                            disabled={!codeSent}
                                                            value={user.code}
                                                            onChange={(e) => {
                                                                setUser({ ...user, code: e.target.value })
                                                            }} />
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

