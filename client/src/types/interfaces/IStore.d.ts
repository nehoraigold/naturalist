import IList from "./IList";
import IUserInfo from "./IUserInfo";

export default interface IStore {
    lists: Array<IList>
    user: IUserInfo
    isCreatingNewList: boolean
    isEditingListTitle: boolean
    selectedList: IList | null
}