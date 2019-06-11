import IToDoStore from "./IToDoStore";
import IAppStore from "./IAppStore";

export default interface Istore {
    toDoStore: IToDoStore
    appStore: IAppStore
}