//region imports
import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import ListItemStore from "../stores/ListItemStore";
//endregion

@inject('rootStore')
@observer
class EditDueDate extends Component<any,any> {
    private dueDateInput: any;

    constructor(props:any) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange() {
        const dueDate = this.dueDateInput.value;
        this.props.rootStore.appStore.selectedList.selectedItem.setDueDate(dueDate);
    }

    render() {
        return (
            <tr>
                <td className='form-desc'>
                    Due Date:
                </td>
                <td colSpan={2}>
                    <input ref={(dueDate) => {this.dueDateInput = dueDate}}
                           type='date'
                           className='edit-task-input'
                           value={this.props.rootStore.appStore.selectedList.selectedItem.dueDate}
                           onChange={this.onChange}/>
                </td>
            </tr>
        )
    }
}

export default EditDueDate;