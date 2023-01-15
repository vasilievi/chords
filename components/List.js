
export default function List(props) {
    const list = props.list

    return (
        <div>
            <h1 className="h2 bg-black text-white m-3">{props.name}</h1>
            <div className="list-group">
                {list.map((item, index) => (
                    <div key={index} className="list-group-item bg-black">
                        <div
                            className="text-white cursor-pointer"
                            value={item.value}
                            onClick={(e) => {
                                props.onSelect(e)
                            }}>
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>

    )
}
