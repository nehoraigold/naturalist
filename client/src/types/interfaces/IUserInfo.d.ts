import {Theme} from "../enums/Theme";

export default interface IUserInfo {
    email: string | null
    id: string | null
    theme: Theme
}