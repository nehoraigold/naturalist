//region imports
import IListItem from "../types/interfaces/IListItem";
import {action, computed, observable} from "mobx";
import * as config from "../../../config.json";
//endregion

export default class ListItemStore implements IListItem {
    @observable description: string;
    @observable completed: boolean = false;
    @observable starred: boolean = false;
    @observable dueDate: string = "";
    @observable notes: string = "";
    id: string;

    constructor(description: string, id: string) {
        this.description = description;
        this.id = id;
    }

    @computed get asObject(): object {
        let listItemObject:any = {};
        for (let prop in this) {
            if (this.hasOwnProperty(prop)) {
                listItemObject[prop] = this[prop];
            }
        }
        listItemObject.timestamp = Date.now();
        return listItemObject;
    }

    @action.bound
    saveItemToDatabase() {
        fetch(`http://localhost:${config.server.port}/item/${this.id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(this.asObject)
        })
            .then(res => res.json())
            .catch(console.log)
            .then(response => console.log(response))
            .catch(console.log);
    }

    @action.bound
    toggleComplete() {
        this.completed = !this.completed;
        this.saveItemToDatabase();
    }

    @action.bound
    toggleStar() {
        this.starred = !this.starred;
        this.saveItemToDatabase();

    }

    @action.bound
    setDueDate(dueDate: string) {
        this.dueDate = dueDate;
        this.saveItemToDatabase();
    }

    @action.bound
    setDescription(description: string) {
        this.description = description;
        this.saveItemToDatabase();
    }

    @action.bound
    setNotes(notes: string) {
        this.notes = notes;
        this.saveItemToDatabase();
    }

    @computed get formattedDate() {
        return this.dueDate.replace('-0', '-').split('-').reverse().join("/");
    }

    @computed get compareDateToToday(): string {
        const
            dateArray = this.formattedDate.split('/'),
            dateDay = parseInt(dateArray[0]),
            dateMonth = parseInt(dateArray[1]),
            dateYear = parseInt(dateArray[2]),
            today = new Date(),
            todayDay = today.getDate(),
            todayMonth = today.getMonth() + 1,
            todayYear = today.getFullYear();

        if (dateYear > todayYear) {
            return "future";
        } else if (dateYear < todayYear) {
            return "past"
        } else {
            if (dateMonth > todayMonth) {
                return "future";
            } else if (dateMonth < todayMonth) {
                return "past"
            } else {
                if (dateDay > todayDay) {
                    return "future";
                } else if (dateDay < todayDay) {
                    return "past";
                } else {
                    return "today"
                }
            }
        }
    }
}