import Link from 'next/link'

export default function Chords(props) {
    const songs = props.songs
    
    return (
        <ul className="list-group">
            {songs.map((song, index) => (
                <li key={index} className="list-group-item bg-black">
                    <div className="row">
                        <div className="col-9">
                            <Link
                                className="text-white no-underline"
                                href={"/songs/" + song.url}
                                spinner-id={"spinner-" + index}
                                onClick={(e) => {
                                    e.target.style = "display:none"
                                    const spinner = document.getElementById(e.target.attributes['spinner-id'].value)
                                    spinner.style.display = ''
                                }}>
                                {song.name}
                            </Link>

                            <div
                                id={"spinner-" + index}
                                className="spinner-grow text-light"
                                role="status"
                                style={{ "display": "none" }}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}
