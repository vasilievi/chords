import classNames from "classnames";
import Link from 'next/link'
import * as Icon from 'react-feather';


export default function List(props) {
    const list = props.list
    const editMode = props.editMode


    return (
        <div className="bg-black">
            <h2 className={classNames('h2', 'bg-black', 'text-warning', 'm-3', { 'd-none': editMode })}>
                {props.name}
            </h2>
            <input
                className={classNames('h2', 'bg-black', 'text-white', 'm-3', { 'd-none': !editMode })}
                value={props.name}
                onChange={(e) =>{props.onChangeName(e)}}
            />

            <div className="list-group">
                {list.map((item, index) => (
                    <div key={index}
                        className={classNames("list-group-item", "bg-black")}>
                        <div className="row">
                            <div className={classNames({'col-9': editMode })}>
                                <Link
                                    className={classNames("cursor-pointer", {
                                        'text-white': !item.selected,
                                        'text-warning': item.selected,
                                    })}
                                    href={item.value}
                                    arrindex={index}
                                    onClick={props.onSelect}>
                                    {item.label}
                                </Link>
                            </div>
                            <div className={classNames({'col-3': editMode })}>
                                <button
                                    className={classNames('btn', 'btn-outline-warning', { 'd-none': !editMode })}
                                    arrindex={index}
                                    onClick={props.onRemoveFromList}
                                >Delete</button>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>

    )
}
