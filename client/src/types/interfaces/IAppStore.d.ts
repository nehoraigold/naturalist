import IList from "./IList";
import IListItem from "./IListItem";
import IUserInfo from "./IUserInfo";

export default interface IAppStore {
    ALL_THEMES: string[]
    isCreatingNewList: boolean
    isEditingListTitle: boolean
    selectedList: IList | null
    userInfo: IUserInfo
}