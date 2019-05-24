import IListItem from "./IListItem";

export default interface IList {
    title: string
    items: Array<IListItem>
    id: number
}