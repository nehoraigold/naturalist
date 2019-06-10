//region imports
import React from "react";
import {observer, inject} from "mobx-react";
import "../css/List.css";
import ListItemStore from "../stores/ListItemStore";
import ListItemComponent from "./ListItemComponent";
import AddListItem from "./AddListItem";
import {ChangeableListTitle} from "./ChangeableListTitle";

//endregion

@inject('rootStore')
@observer
class ListComponent extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.renderListItems = this.renderListItems.bind(this);
        this.renderProperTitle = this.renderProperTitle.bind(this);
        this.editListTitle = this.editListTitle.bind(this);
        this.deleteList = this.deleteList.bind(this);
    }

    renderListItems(completeBool: boolean): Array<ListItemComponent> {
        let listItems = this.props.rootStore.appStore.selectedList.returnListItems(completeBool);
        return listItems.map((item: ListItemStore) => <ListItemComponent key={item.id} id={item.id}/>);
    }

    static renderNoItemsCompletedMessage() {
        return <div className='no-items-completed-message'>No tasks completed yet!</div>;
    }

    editListTitle() {
        this.props.rootStore.appStore.toggleIsEditingListTitle(true);
    }

    deleteList() {
        let currentListId = this.props.rootStore.appStore.selectedList.id;
        this.props.rootStore.deleteList(currentListId);
    }

    renderProperTitle() {
        return this.props.rootStore.appStore.isEditingListTitle ?
            <ChangeableListTitle/> :
            <div>
                <h3 className='list-title'>
                    {this.props.rootStore.appStore.selectedList.title}
                    <span className="fas fa-trash-alt list-title-icon trash-can"
                          onClick={this.deleteList}/>
                    <span className='fas fa-pencil-alt list-title-icon'
                          onClick={this.editListTitle}
                    />
                </h3>
            </div>
    }

    render() {
        return (
            <div className='list'>
                {this.renderProperTitle()}
                <AddListItem/>
                <div className='list-items'>
                    {this.renderListItems(false)}
                </div>
                <br/>
                <h3 className='list-title'>Done</h3>
                <div className='completed-list-items list-items'>
                    {this.renderListItems(true).length > 0 ?
                        this.renderListItems(true) :
                        ListComponent.renderNoItemsCompletedMessage()}
                </div>
            </div>
        )
    }
}

export default ListComponent;