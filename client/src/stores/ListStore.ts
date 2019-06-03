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
    addItem(description: string): ListStore {
        fetch(`http://localhost:${config.server.port}/save?type=list`)
        this.items.push(new ListItemStore(description, "FAKE_ID"));
        return this;
    }

    @action.bound
    deleteItem(listItem: ListItemStore): ListStore {
        //TODO: delete item in database
        this.items = this.items.filter(item => item !== listItem);
        return this;
    }

    @action.bound
    setTitle(newTitle: string): ListStore {
        //TODO: update list in database
        this.title = newTitle;
        debug.log("setting title to '" + newTitle + "'");
        return this;
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