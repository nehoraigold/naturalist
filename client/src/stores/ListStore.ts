//region imports
import IList from "../types/interfaces/IList";
import {action, observable} from "mobx";
import ListItemStore from "./ListItemStore";
import {debug} from "../DEBUG";
import * as config from "../../../config.json";
//endregion

export default class ListStore implements IList {
    @observable title: string;
    @observable items: ListItemStore[] = [];
    @observable selectedItem: ListItemStore | null = null;
    public id: string;

    constructor(title: string, id: string) {
        this.title = title;
        this.id = id;
    }

    @action.bound
    addItem(description: string) {
        console.log("NEW ITEM DESCRIPTION", description);
        fetch(`http://localhost:${config.server.port}/item`, {
            method: "POST",
            body: JSON.stringify({listId: this.id, newItemDescription: description, timestamp: Date.now()}),
            headers: {"Content-Type": "application/json"}
        })
            .then(res => res.json())
            .catch(console.log)
            .then((response) => {
                console.log(response);
                this.items.push(new ListItemStore(description, response.data.items.pop()));
            })
            .catch(console.log);
    }

    @action.bound
    deleteItem(listItem: ListItemStore) {
        fetch(`http://localhost:${config.server.port}/item/${listItem.id}`, {
            method: "DELETE",
            body: JSON.stringify({listId: this.id, listItemId: listItem.id}),
            headers: {"Content-Type": "application/json"}
        })
            .then(res => res.json())
            .catch(console.log)
            .then(response => {
                console.log(response);
                this.items = this.items.filter(item => item !== listItem);
            })
            .catch(console.log);
    }

    @action.bound
    setTitle(newTitle: string) {
        fetch(`http://localhost:${config.server.port}/list/${this.id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title: this.title, timestamp: Date.now()})
        })
            .then(res => res.json())
            .catch(console.log)
            .then(() => {
                this.title = newTitle;
                debug.log("setting title to '" + newTitle + "'");
            })
            .catch(console.log);

    }

    returnListItems(completeBool: boolean) {
        let starredItems = this.items.filter((item: ListItemStore) => item.completed === completeBool && item.starred);
        let unstarredItems = this.items.filter((item: ListItemStore) => item.completed === completeBool && !item.starred);
        return starredItems.concat(unstarredItems);
    }

    @action.bound
    selectItem(listItem: ListItemStore) {
        this.selectedItem = listItem;
    }

    @action.bound
    deselectItem() {
        this.selectedItem = null;
    }

    findItem(itemId: string) {
        return this.items.find((item: ListItemStore) => item.id === itemId);
    }
}