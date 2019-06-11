//region imports
import React from "react";
import {inject, observer} from "mobx-react";
import ListItemStore from "../stores/ListItemStore";
import {observable} from "mobx";
//endregion

@inject('store')
@observer
class EditDescription extends React.Component<any, any> {
    private descriptionInput: any;

    constructor(props:any) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange() {
        const description = this.descriptionInput.value;
        this.props.store.selectedList.selectedItem.setDescription(description);
    }

    render() {
        return (
            <tr>
                <td className='form-desc'>
                    Description:
                </td>
                <td colSpan={2}>
                <textarea ref={(description) => this.descriptionInput = description}
                          placeholder="Add a description..."
                          value={this.props.store.selectedList.selectedItem.description}
                          className='edit-task-input'
                          rows={3}
                          onChange={this.onChange}/>
                </td>
            </tr>
        )
    }
}

export default EditDescription;