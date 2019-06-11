//region imports
import IStore from "../types/interfaces/IStore";
import {observable, action, computed} from "mobx";
import IUserInfo from "../types/interfaces/IUserInfo";
import ListStore from "./ListStore";
import {debug} from "../DEBUG";
import * as config from "../../../config.json";
import ListItemStore from "./ListItemStore";
import IList from "../types/interfaces/IList";
import {Theme} from "../types/enums/Theme";
//endregion

class Store implements IStore {
    @observable isCreatingNewList: boolean = false;
    @observable isEditingListTitle: boolean = false;
    @observable selectedList: null | ListStore = null;
    @observable lists: Array<ListStore> = [];
    @observable user: IUserInfo = {
        email: null,
        id: null,
        theme: Theme.blue
    };

    //region computed
    @computed get authenticated() {
        return this.user.id && this.user.email;
    }
    //endregion

    //region actions
    @action.bound
    toggleIsCreatingNewList(isCreatingNewList: boolean) {
        this.isCreatingNewList = isCreatingNewList;
        debug.log("creating new list: " + this.isCreatingNewList);
    }

    @action.bound
    toggleIsEditingListTitle(isEditingListTitle: boolean) {
        this.isEditingListTitle = isEditingListTitle;
        debug.log("editing list title: " + this.isEditingListTitle);
    }

    @action.bound
    selectList(listId: string) {
        let selectedList = this.lists.find((list: IList) => list.id === listId);
        if (!selectedList) {
            debug.log("Could not find selected list");
            return;
        }
        this.selectedList = selectedList;
        debug.log("new selected list: " + selectedList.title)
    }

    @action.bound
    authenticate(userInfo: object) {
        for (let prop in userInfo) {
            if (userInfo.hasOwnProperty(prop) && (this.user.hasOwnProperty(prop) || prop === "_id")) {
                this.user[prop === "_id" ? "id" : prop] = userInfo[prop];
            }
        }
    }

    @action.bound
    logoutAndWipeData() {
        this.isCreatingNewList = false;
        this.isEditingListTitle = false;
        this.selectedList = null;
        this.lists = [];
        this.user = {
            email: null,
            id: null,
            theme: Theme.blue
        };
    }

    @action.bound
    setTheme(theme: string) {
        for (let color in Theme) {
            console.log(color);
            if (Theme[color] === theme) {
                this.user.theme = Theme[Theme[color]];
                if (this.authenticated) {
                    this.saveTheme();
                }
                this.showTheme();
                return true;
            }
        }
        return false;
    }
    //endregion

    //region server calls
    createList(listName: string) {
        fetch(`http://localhost:${config.server.port}/list`, {
            method: "POST",
            body: JSON.stringify({userId: this.user.id, title: listName}),
            headers: {"Content-Type": "application/json"}
        })
            .then(res => res.json())
            .catch(console.log)
            .then((response) => {
                console.log(response);
                const newList = new ListStore(listName, response.data.lists.pop());
                this.lists.push(newList);
                this.selectList(newList.id);
                this.toggleIsCreatingNewList(false);
            })
            .catch(console.log);
    }

    deleteList(listId: string) {
        fetch(`http://localhost:${config.server.port}/list/${listId}`, {
            method: "DELETE",
            body: JSON.stringify({userId: this.user.id, listId, timestamp: Date.now()}),
            headers: {"Content-Type": "application/json"}
        })
            .then(res => res.json())
            .catch(console.log)
            .then((response) => {
                console.log(response);
                const list = this.lists.find(list => list.id === listId);
                const index = list ? this.lists.indexOf(list) : 0;
                const newIndex = Math.max(index - 1, 0);
                this.lists = this.lists.filter(list => list.id !== listId);
                this.selectedList = this.lists[newIndex];
            })
            .catch(console.log);
    }

    saveTheme() {
        fetch(`http://localhost:${config.server.port}/user/${this.user.id}`, {
            method: "PUT",
            body: JSON.stringify({theme: this.user.theme, timestamp: Date.now()}),
            headers: {"Content-Type": "application/json"}
        })
            .then(res => res.json())
            .catch(console.log)
            .then(console.log)
            .catch(console.log);
    }
    //endregion

    loadDataAndAuthenticate(serverResponse) {
        this.loadData(serverResponse.data.user.lists);
        this.selectedList = this.lists[0];
        this.setTheme(serverResponse.data.user.theme);
        this.authenticate(serverResponse.data.user);
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
            this.lists.push(listStore);
        })
    }

    showTheme() {
        // @ts-ignore
        document.getElementById('theme').setAttribute(
            "href",
            `/themes/${this.user.theme}.css`
        );
        debug.log("theme changed to " + this.user.theme);
    }
}

export const store = new Store();