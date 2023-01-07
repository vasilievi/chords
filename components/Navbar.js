export default function Navbar(props) {
    return (
        <nav className="navbar navbar-dark bg-black">
            <div className="container-fluid">
                <a href="/" className="navbar-brand">Chords</a>
                <form className="d-flex">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-light" type="submit">Search</button>
                </form>
            </div>
        </nav>
    )
}
