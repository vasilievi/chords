import "bootstrap/dist/css/bootstrap.css"
import { useState } from 'react';

function homepage(params) {
    const [textState, setTextState] = useState('init text');

    const onClickSend = async (e) => {
        e.target.disabled = true
        const res = await fetch('/api/addData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ "text": textState })
        });
        const resJson = await res.json()
        console.log(resJson);
        e.target.disabled = false
    }

    return (
        <div className="border border-success m-3 p-3">
            <h1 className="text-primary">Welcome home!</h1>
            <input placeholder="text"
                value={textState}
                onChange={(e) => {
                    setTextState(e.target.value)
                }} />
            <button className="btn btn-success" onClick={onClickSend}>Send</button>
        </div>
    )
}

export default homepage