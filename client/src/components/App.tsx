//region imports
import React, {Component} from 'react';
import '../css/App.css';
import {inject, observer} from "mobx-react";
import SideMenu from "./SideMenu";
import ListComponent from "./ListComponent";
import ProtoList from "./ProtoList";
import EditListItem from "./EditListItem";
//endregion

@inject('store')
@observer
class App extends Component<any, any> {
    render() {
        let size =
            this.props.store.selectedList === null ||
            this.props.store.selectedList.selectedItem === null ||
            this.props.store.isCreatingNewList ? "full-size" : "half-size";
        return (
                <div className='main-app'>
                    <SideMenu/>
                    <div className={`current-list ${size}`}>
                        {this.props.store.isCreatingNewList ?
                            <ProtoList/> : <ListComponent/>}
                    </div>
                    {this.props.store.selectedList !== null &&
                    this.props.store.selectedList.selectedItem !== null &&
                    !this.props.store.isCreatingNewList ?
                        <EditListItem/> : null}
                </div>
        );
    }
}

export default App;
