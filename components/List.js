import classNames from "classnames";
import * as Icon from 'react-feather';
import Link from 'next/link'


export default function List(props) {
    const list = props.list

    return (
        <div>
            <h1 className="h2 bg-black text-white m-3">{props.name}</h1>
            {/* Buttons */}
            <div className='row m-3'>
                <div className="col-auto">
                    <div className='btn-group'>
                    <button className='btn btn-outline-light'
                            onClick={(e) => {
                                props.onCreateItem(e)
                            }}
                        ><Icon.Plus /></button>
                    </div>
                </div>
            </div>
            <div className="list-group">
                {list.map((item, index) => (
                    <div key={index}
                        className={classNames("list-group-item", "bg-black")}>
                        <Link
                            className={classNames("cursor-pointer", {
                                'text-white': !item.selected,
                                'text-warning': item.selected,
                            })}
                            href={'/songs/' + item.value}
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
