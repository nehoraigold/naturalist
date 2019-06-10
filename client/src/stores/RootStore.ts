//region imports
import {observable} from "mobx";
import {AppStore, appStore} from "./AppStore";
import {ToDoStore, toDoStore} from "./ToDoStore";
import IList from "../types/interfaces/IList";
import ListStore from "./ListStore";
import ListItemStore from "./ListItemStore";
import {debug} from "../DEBUG";
import * as config from "../../../config.json";

declare const window: any;

//endregion

class RootStore {
    //TODO: Eventually, consolidate to one store -- no need for separate app and todo stores now that listcounter is obsolete
    //TODO: For all fetch functions - add a loading gif
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
        console.log("NEW LIST TITLE", listName);
        fetch(`http://localhost:${config.server.port}/list`, {
            method: "POST",
            body: JSON.stringify({userId: this.appStore.userInfo.id, title: listName}),
            headers: {"Content-Type": "application/json"}
        })
            .then(res => res.json())
            .catch(console.log)
            .then((response) => {
                console.log(response);
                const newList = this.toDoStore.createNewList(listName, response.data.lists.pop());
                this.appStore.selectList(newList);
                this.appStore.toggleIsCreatingNewList(false);
            })
            .catch(console.log);
    }

    deleteList(listId: string) {
        console.log("List ID to delete:", listId);
        fetch(`http://localhost:${config.server.port}/list/${listId}`, {
            method: "DELETE",
            body: JSON.stringify({userId: this.appStore.userInfo.id, listId}),
            headers: {"Content-Type": "application/json"}
        })
            .then(res => res.json())
            .catch(console.log)
            .then((response) => {
                console.log(response);
                const list = this.toDoStore.lists.find(list => list.id === listId);
                const index = list ? this.toDoStore.lists.indexOf(list) : 0;
                const newIndex = Math.max(index - 1, 0);
                this.toDoStore.lists = this.toDoStore.lists.filter(list => list.id !== listId);
                this.appStore.selectedList = this.toDoStore.lists[newIndex];
            })
            .catch(console.log);
    }

    logoutAndWipeData() {
        this.appStore = new AppStore();
        this.toDoStore = new ToDoStore();
    }

    loadDataAndAuthenticate(serverResponse) {
        this.loadData(serverResponse.data.user.lists);
        this.appStore.selectedList = this.toDoStore.lists[0];
        this.appStore.authenticate(serverResponse.data.user);
    }

    loadData(listOfLists) {
        listOfLists.forEach(list => {
            let listStore = new ListStore(list.title, list._id);
            listStore.items = list.items.map(item => {
                let listItemStore = new ListItemStore(item.description, item._id);
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