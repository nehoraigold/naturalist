//region imports
import {observable, action} from "mobx";
import IToDoStore from "../types/interfaces/IToDoStore";
import ListStore, {defaultList} from "./ListStore";
//endregion

export class ToDoStore implements IToDoStore {
    @observable lists: Array<ListStore> = [defaultList];
    @observable listIdIncrementer: number = 1;

    @action.bound
    createNewList(newListName: string) {
        let newList = new ListStore(newListName, this.listIdIncrementer++);
        this.lists.push(newList);
        return newList;
    }

    @action.bound
    deleteList(listID: number) {
        this.lists = this.lists.filter(list => list.id !== listID);
    }
}

export const toDoStore = new ToDoStore();