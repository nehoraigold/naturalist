//region imports
import IListItem from "../types/interfaces/IListItem";
import {action, computed, observable} from "mobx";
//endregion

export default class ListItemStore implements IListItem {
    @observable description: string;
    @observable completed: boolean = false;
    @observable starred: boolean = false;
    @observable dueDate: string = "";
    @observable notes: string = "";
    id: number = Date.now();

    constructor(description: string) {
        this.description = description;
    }

    @action.bound
    toggleComplete() {
        this.completed = !this.completed
    }

    @action.bound
    toggleStar() {
        this.starred = !this.starred
    }

    @action.bound
    setDueDate(dueDate: string) {
        this.dueDate = dueDate;
    }

    @action.bound
    setDescription(description: string) {
        this.description = description
    }

    @action.bound
    setNotes(notes: string) {
        this.notes = notes;
    }

    @computed
    get formattedDate() {
        return this.dueDate.replace('-0', '-').split('-').reverse().join("/");
    }

    @computed
    get compareDateToToday(): string {
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