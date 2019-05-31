//region imports
import {observable, action} from "mobx";
import IAppStore from "../types/interfaces/IAppStore";
import ListStore from "./ListStore";
import {debug} from "../DEBUG";
//endregion

export class AppStore implements IAppStore {
    ALL_THEMES: Array<string> = ["blue", "green", "purple", "yellow"];
    @observable selectedTheme: string = "blue";
    @observable isCreatingNewList: boolean = false;
    @observable isEditingListTitle: boolean = false;
    @observable selectedList: null | ListStore = null;
    @observable authenticated: boolean = false;

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
    selectList(list: ListStore) {
        this.selectedList = list;
        debug.log("new selected list: " + list.title)
    }

    @action.bound
    setTheme(theme: string) {
        for (let i = 0; i < this.ALL_THEMES.length; i++) {
            if (this.ALL_THEMES[i] === theme) {
                this.selectedTheme = theme;
                this.showTheme();
                return true;
            }
        }
        return false;
    }

    @action.bound
    authenticate() {
        this.authenticated = true;
    }

    showTheme() {
        // @ts-ignore
        document.getElementById('theme').setAttribute(
            "href",
            `/themes/${this.selectedTheme}.css`
        );
        debug.log("theme changed to " + this.selectedTheme);
    }
}

export const appStore = new AppStore();