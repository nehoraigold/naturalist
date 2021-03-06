//region imports
import React from "react";
import {inject, observer} from "mobx-react";
import EditDescription from "./EditDescription";
import EditStatus from "./EditStatus";
import EditDueDate from "./EditDueDate";
import EditNotes from "./EditNotes";
import "../css/EditListItem.css";
//endregion

//TODO: add proper typing to everything

@inject('store')
@observer
class EditListItem extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.closeEditItemScreen = this.closeEditItemScreen.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    deleteItem(e: any) {
        e.preventDefault();
        this.props.store.selectedList.deleteItem(this.props.store.selectedList.selectedItem);
        this.props.store.selectedList.deselectItem();
    }

    closeEditItemScreen(e: any) {
        e.preventDefault();
        this.props.store.selectedList.deselectItem();
    }

    render() {
        return (
            <div className='list-item-edit-container half-size'>
                <div className='list-item-edit-screen'>
                    <h4>
                        Edit Task: {this.props.store.selectedList.selectedItem.description.length > 20 ?
                            `${this.props.store.selectedList.selectedItem.description.slice(0,20)}...` :
                            this.props.store.selectedList.selectedItem.description}
                        <span onClick={this.closeEditItemScreen}
                              className="fas fa-times-circle edit-task-header-icon"/>
                    </h4>
                    <form>
                        <table>
                            <tbody>
                            <EditDescription/>
                            <EditStatus/>
                            <EditDueDate/>
                            <EditNotes/>
                            </tbody>
                        </table>
                        <div className='edit-task-buttons'>
                            <button onClick={this.closeEditItemScreen} className='btn edit-task-btn'>OK</button>
                            <button onClick={this.deleteItem} className='btn edit-task-btn btn-danger'>Delete Task
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default EditListItem;

