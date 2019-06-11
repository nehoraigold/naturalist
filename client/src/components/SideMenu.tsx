//region imports
import React from "react";
import {observer, inject} from "mobx-react";
import "../css/SideMenu.css";
import ListStore from "../stores/ListStore";
//endregion

@inject('store')
@observer
class SideMenu extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.createNewList = this.createNewList.bind(this);
        this.changeSelectedList = this.changeSelectedList.bind(this);
        this.renderListTitles = this.renderListTitles.bind(this);
    }

    createNewList() {
        if (this.props.store.selectedList.title.trim() === "") {
            return;
        }
        this.props.store.toggleIsEditingListTitle(false);
        this.props.store.toggleIsCreatingNewList(true);
    }

    changeSelectedList(event: any) {
        if (this.props.store.selectedList.title === "") {
            return;
        }
        this.props.store.toggleIsCreatingNewList(false);
        const selectedListId = event.target.getAttribute("data-list-id");
        this.props.store.selectList(selectedListId);

    }

    renderListTitles(): Array<HTMLLIElement> {
        return this.props.store.lists.map((list:ListStore) =>
            <li className={`${this.props.store.isCreatingNewList ? "" :
                    (list === this.props.store.selectedList ? "current-list-title" : "")}`}
                key={list.id}
                data-list-id={list.id}
                onClick={this.changeSelectedList}>{list.title}</li>)
    }

    render() {
        return (
            <div className='side-menu'>
                <ul className='all-list-titles'>
                    {this.renderListTitles()}
                    <li onClick={this.createNewList}
                        className={`${this.props.store.isCreatingNewList ? "current-list-title" : ""}`}
                        key={"+"}>
                        +
                    </li>
                </ul>
            </div>
        )
    }
}

export default SideMenu;