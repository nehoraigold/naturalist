//region imports
import React, {Component, Fragment} from 'react';
import '../css/App.css';
import {inject, observer} from "mobx-react";
import TopMenu from "./TopMenu";
import SideMenu from "./SideMenu";
import ListComponent from "./ListComponent";
import ProtoList from "./ProtoList";
import EditListItem from "./EditListItem";
import {rootStore} from "../stores/RootStore";

//endregion

@inject('rootStore')
@observer
class App extends Component<any, any> {
    render() {
        let size =
            this.props.rootStore.appStore.selectedList.selectedItem === null ||
            this.props.rootStore.appStore.isCreatingNewList ? "full-size" : "half-size";
        return (
                <div className='main-app'>
                    <SideMenu/>
                    <div className={`current-list ${size}`}>
                        {this.props.rootStore.appStore.isCreatingNewList ?
                            <ProtoList/> : <ListComponent/>}
                    </div>
                    {this.props.rootStore.appStore.selectedList.selectedItem !== null &&
                    !this.props.rootStore.appStore.isCreatingNewList ?
                        <EditListItem/> : null}
                </div>
        );
    }
}

export default App;
