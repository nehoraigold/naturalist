//region imports
import React from "react";
import {inject, observer} from "mobx-react";
import ListItemStore from "../stores/ListItemStore";
//endregion

@inject('store')
@observer
class EditStatus extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <tr>
                <td className='form-desc'>
                    Status:
                </td>
                <td>
                    <label htmlFor={`edit-item-${this.props.store.selectedList.selectedItem.id}`}>
                        <div className='checkbox-container'>
                            <div className={`fas fa-check checkmark ${this.props.store.selectedList.selectedItem.completed ? "" : "unchecked"}`}/>
                            <input onChange={this.props.store.selectedList.selectedItem.toggleComplete}
                                   type='checkbox'
                                   className='input-checkbox'
                                   checked={this.props.store.selectedList.selectedItem.completed}
                                   id={`edit-item-${this.props.store.selectedList.selectedItem.id}`}/>
                        </div>
                        <span className={`${this.props.store.selectedList.selectedItem.completed ? "completed-item" : "incomplete-item"}`}>
                            {this.props.store.selectedList.selectedItem.completed ? "Complete" : "Incomplete"}
                        </span>
                    </label>
                </td>
                <td>
                    <label onClick={this.props.store.selectedList.selectedItem.toggleStar}>
                        <div className='star-item'>
                            <span className={`star ${this.props.store.selectedList.selectedItem.starred ? 'fas fa-star starred' : 'far fa-star'}`}/>
                        </div>
                        <span className={`${this.props.store.selectedList.selectedItem.starred ? "starred-item" : "unstarred-item"}`}>
                            {this.props.store.selectedList.selectedItem.starred ? "Starred" : "Unstarred"}
                        </span>
                    </label>
                </td>
            </tr>
        )
    }
}

export default EditStatus;