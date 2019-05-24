import IList from "./IList";
import IListItem from "./IListItem";

export default interface IAppStore {
    ALL_THEMES: string[]
    selectedTheme: string
    isCreatingNewList: boolean
    isEditingListTitle: boolean
    selectedList: IList
}