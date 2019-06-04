//region imports
import {observable, action, computed} from "mobx";
import IAppStore from "../types/interfaces/IAppStore";
import ListStore from "./ListStore";
import {debug} from "../DEBUG";
import IUserInfo from "../types/interfaces/IUserInfo";
//endregion

export class AppStore implements IAppStore {
    ALL_THEMES: Array<string> = ["blue", "green", "purple", "yellow"];
    @observable isCreatingNewList: boolean = false;
    @observable isEditingListTitle: boolean = false;
    @observable selectedList: null | ListStore = null;
    @observable userInfo: IUserInfo = {
        email: null,
        id: null,
        theme: "blue"
    };

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
                this.userInfo.theme = theme;
                this.showTheme();
                return true;
            }
        }
        return false;
    }

    @action.bound
    authenticate(userInfo: object) {
        for (let prop in userInfo) {
            if (userInfo.hasOwnProperty(prop) && (this.userInfo.hasOwnProperty(prop) || prop === "_id")) {
                this.userInfo[prop === "_id" ? "id" : prop] = userInfo[prop];
            }
        }
    }

    @computed get authenticated() {
        return this.userInfo.id && this.userInfo.email;
    }

    showTheme() {
        // @ts-ignore
        document.getElementById('theme').setAttribute(
            "href",
            `/themes/${this.userInfo.theme}.css`
        );
        debug.log("theme changed to " + this.userInfo.theme);
    }
}

export const appStore = new AppStore();