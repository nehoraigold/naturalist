//region imports
import React from "react";
import {observer, inject} from "mobx-react";
import "../css/SideMenu.css";
import ListStore from "../stores/ListStore";
//endregion

@inject('rootStore')
@observer
class SideMenu extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.createNewList = this.createNewList.bind(this);
        this.changeSelectedList = this.changeSelectedList.bind(this);
        this.renderListTitles = this.renderListTitles.bind(this);
    }

    createNewList() {
        if (this.props.rootStore.appStore.selectedList.title.trim() === "") {
            return;
        }
        this.props.rootStore.appStore.toggleIsEditingListTitle(false);
        this.props.rootStore.appStore.toggleIsCreatingNewList(true);
    }

    changeSelectedList(event: any) {
        if (this.props.rootStore.appStore.selectedList.title === "") {
            return;
        }
        this.props.rootStore.appStore.toggleIsCreatingNewList(false);
        const selectedListId = parseInt(event.target.getAttribute("data-list-id"));
        this.props.rootStore.selectList(selectedListId);

    }

    renderListTitles(): Array<HTMLLIElement> {
        return this.props.rootStore.toDoStore.lists.map((list:ListStore) =>
            <li className={`${this.props.rootStore.appStore.isCreatingNewList ? "" :
                    (list === this.props.rootStore.appStore.selectedList ? "current-list-title" : "")}`}
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
                        className={`${this.props.rootStore.appStore.isCreatingNewList ? "current-list-title" : ""}`}>
                        +
                    </li>
                </ul>
            </div>
        )
    }
}

export default SideMenu;