//region imports
import {observable} from "mobx";
import {AppStore, appStore} from "./AppStore";
import {ToDoStore, toDoStore} from "./ToDoStore";
import IList from "../types/interfaces/IList";

declare const window: any;

//endregion

class RootStore {
    @observable toDoStore: ToDoStore = toDoStore;
    @observable appStore: AppStore = appStore;

    selectList(listId: number) {
        let selectedList = this.toDoStore.lists.find((list: IList) => list.id === listId);
        if (!selectedList) {
            return;
        }
        this.appStore.selectList(selectedList);
    }

    createList(listName: string) {
        const newList = this.toDoStore.createNewList(listName);
        this.appStore.selectList(newList);
        this.appStore.toggleIsCreatingNewList(false);
    }
}


export const rootStore = new RootStore();
window.rootStore = rootStore;