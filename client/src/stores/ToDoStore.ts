//region imports
import {observable, action} from "mobx";
import IToDoStore from "../types/interfaces/IToDoStore";
import ListStore from "./ListStore";
//endregion

export class ToDoStore implements IToDoStore {
    @observable lists: Array<ListStore> = [];

    @action.bound
    createNewList(newListName: string, id: string) {
        let newList = new ListStore(newListName, id);
        this.lists.push(newList);
        return newList;
    }
}

export const toDoStore = new ToDoStore();