//region imports
import React from "react";
import {observer, inject} from "mobx-react";
import "../css/AddListItem.css";
//endregion

@inject('store')
@observer
class AddListItem extends React.Component<any,any> {
    private input:any;
    constructor(props:any) {
        super(props);
        this.createListItem = this.createListItem.bind(this);
    }

    createListItem(event:any) {
        if (this.input.value.trim() === "") {
            return false;
        }
        //@ts-ignore
        if ((event.target.tagName === "INPUT" && event.keyCode === 13) || (event.target.tagName === "BUTTON")) {
            this.props.store.selectedList.addItem(this.input.value);
            this.input.value = "";
        }
    }

    render() {
        return (
            <div className='card'>
                <div className='card-body'>
                    <input type='text'
                           placeholder='Add a new task...'
                           className='add-item'
                           ref={(input:HTMLInputElement) => this.input = input}
                           onKeyUp={this.createListItem} />
                    <button className='btn add-button' onClick={this.createListItem}>Add</button>
                </div>
            </div>
        )
    }
}

export default AddListItem;