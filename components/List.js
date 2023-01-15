import classNames from "classnames";
import * as Icon from 'react-feather';


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
                        ><Icon.Edit /></button>
                        <button className='btn btn-outline-light'
                            onClick={(e) => {
                                props.onEditItem(e)
                            }}
                        ><Icon.Trash2 /></button>
                        <button className='btn btn-outline-light'
                            onClick={(e) => {
                                props.onDeleteItem(e)
                            }}
                        ><Icon.PlusSquare /></button>
                    </div>
                </div>
            </div>
            <div className="list-group">
                {list.map((item, index) => (
                    <div key={index}
                        className={classNames("list-group-item", "bg-black")}>
                        <div
                            className={classNames("cursor-pointer", {
                                'text-white': !item.selected,
                                'text-warning': item.selected,
                            })}
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
