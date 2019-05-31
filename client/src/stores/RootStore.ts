//region imports
import {observable} from "mobx";
import {AppStore, appStore} from "./AppStore";
import {ToDoStore, toDoStore} from "./ToDoStore";
import IList from "../types/interfaces/IList";
import ListStore from "./ListStore";
import ListItemStore from "./ListItemStore";
import {debug} from "../DEBUG";

declare const window: any;

//endregion

class RootStore {
    @observable toDoStore: ToDoStore = toDoStore;
    @observable appStore: AppStore = appStore;

    selectList(listId: string) {
        let selectedList = this.toDoStore.lists.find((list: IList) => list.id === listId);
        if (!selectedList) {
            debug.log("Could not find selected list");
            return;
        }
        this.appStore.selectList(selectedList);
    }

    createList(listName: string) {
        //create new list in database
        const newList = this.toDoStore.createNewList(listName, "FAKE_ID");
        this.appStore.selectList(newList);
        this.appStore.toggleIsCreatingNewList(false);
    }

    login(serverResponse) {
        console.log("SERVER RESPONSE HERE", serverResponse);
        this.loadData(serverResponse.data.user.lists);
        this.appStore.selectedList = this.toDoStore.lists[0];
        this.appStore.authenticate();
    }

    loadData(listOfLists) {
        listOfLists.forEach(list => {
            let listStore = new ListStore(list.title, list._id);
            listStore.items = list.items.map(item => {
                let listItemStore = new ListItemStore(item.description);
                for (let prop in item) {
                    if (prop && item.hasOwnProperty(prop) && listItemStore.hasOwnProperty(prop)) {
                        listItemStore[prop] = item[prop];
                    }
                }
                return listItemStore;
            });
            this.toDoStore.lists.push(listStore);
        })
    }
}


export const rootStore = new RootStore();
window.rootStore = rootStore;