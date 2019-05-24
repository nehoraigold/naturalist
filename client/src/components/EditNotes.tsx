//region imports
import React from "react";
import {inject, observer} from "mobx-react";
import ListItemStore from "../stores/ListItemStore";
//endregion

@inject('rootStore')
@observer
class EditNotes extends React.Component<any, any> {
    private notesInput: any;

    constructor(props: any) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange() {
        const notes = this.notesInput.value;
        this.props.rootStore.appStore.selectedList.selectedItem.setNotes(notes);
    }

    render() {
        return (
            <tr>
                <td className='form-desc'>
                    Notes:
                </td>
                <td colSpan={2}>
                    <textarea ref={(notes) => this.notesInput = notes}
                              className='edit-task-input'
                              placeholder="Add notes..."
                              rows={5}
                              value={this.props.rootStore.appStore.selectedList.selectedItem.notes}
                              onChange={this.onChange}/>
                </td>
            </tr>
        )
    }
}

export default EditNotes;