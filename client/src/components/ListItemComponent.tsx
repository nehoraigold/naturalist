//region imports
import React from "react";
import "../css/ListItem.css";
import {observer, inject} from "mobx-react";
import {computed} from "mobx";
import ListItemStore from "../stores/ListItemStore";
import {debug} from "../../../DEBUG";

//endregion

@inject('rootStore')
@observer
class ListItemComponent extends React.Component<any, any> {
    public item: ListItemStore;

    constructor(props: any) {
        super(props);
        this.selectListItem = this.selectListItem.bind(this);
        this.item = this.props.rootStore.appStore.selectedList.findItem(this.props.id);
    }

    @computed get renderDueDateIfNeeded() {
        if (this.item.dueDate === null) {
            return null;
        }
        const coloring = this.item.completed ? "due-date-complete" :
            (this.item.compareDateToToday === "past" ? "due-date-past" : null);
        return <div className={`item-due-date ${coloring}`}>{this.item.formattedDate}</div>
    }

    selectListItem() {
        this.props.rootStore.appStore.selectedList.selectItem(this.item);
        debug.log('new selected item: ' + this.item.description);
    }

    render() {
        return (
            <div className={`card ${this.item.completed ? "completed" : ""}`}>
                <div className='card-body'>
                    <label htmlFor={`item-${this.item.id}`}>
                        <div className='checkbox-container'>
                            <div className={`fas fa-check checkmark ${this.item.completed ? "" : "unchecked"}`}/>
                            <input type='checkbox'
                                   className='input-checkbox'
                                   onChange={this.item.toggleComplete}
                                   checked={this.item.completed}
                                   id={`item-${this.item.id}`}/>
                        </div>
                    </label>
                    <label htmlFor={`item-${this.item.id}`}
                           className={`task-container ${this.item.description ? "" : "empty-description"}`}>
                        <div>{this.item.description ? this.item.description : "Add a description..."}</div>
                    </label>
                    {this.renderDueDateIfNeeded}
                    <div className='star-item' onClick={this.item.toggleStar}>
                        <span className={`star ${this.item.starred ? 'fas fa-star starred' : 'far fa-star'}`}/>
                    </div>
                    <div className="edit-item" onClick={this.selectListItem}>
                        <div className="edit-item-dot"/>
                        <div className="edit-item-dot"/>
                        <div className="edit-item-dot"/>
                    </div>
                </div>
            </div>
        )
    }
}

export default ListItemComponent;