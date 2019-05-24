import IToDoStore from "./IToDoStore";
import IAppStore from "./IAppStore";

export default interface IRootStore {
    toDoStore: IToDoStore
    appStore: IAppStore
}