import classNames from "classnames";
import Link from 'next/link'


export default function List(props) {
    const list = props.list

    return (
        <div className="bg-black">
            <h1 className="h2 bg-black text-white m-3">{props.name}</h1>
            <div className="list-group">
                {list.map((item, index) => (
                    <div key={index}
                        className={classNames("list-group-item", "bg-black")}>
                        <Link
                            className={classNames("cursor-pointer", {
                                'text-white': !item.selected,
                                'text-warning': item.selected,
                            })}
                            href={item.value}
                            arrindex={index}
                            onClick={(e) => {
                                props.onSelect(e)
                            }}>
                            {item.label}
                        </Link>
                    </div>
                ))}
            </div>
        </div>

    )
}
