//region imports
import React, {ChangeEvent} from "react";
import {inject, observer} from "mobx-react";

//endregion

@inject('rootStore')
@observer
export class ChangeableListTitle extends React.Component<any, any> {
    private input: any;

    constructor(props: any) {
        super(props);
        this.changeInput = this.changeInput.bind(this);
        this.confirmList = this.confirmList.bind(this);
        this.cancelList = this.cancelList.bind(this);
        this.state = {
            title: this.props.rootStore.appStore.isEditingListTitle ?
                this.props.rootStore.appStore.selectedList.title : ""
        }
    }

    confirmList(event: any) {
        if (this.input.value.trim() === "") {
            return false;
        }
        if ((event.target.tagName === "INPUT" && event.keyCode === 13) || (event.target.tagName === "SPAN")) {
            if (this.props.rootStore.appStore.isCreatingNewList) {
                let newListName = this.input.value;
                this.props.rootStore.createList(newListName);
            } else if (this.props.rootStore.appStore.isEditingListTitle) {
                this.props.rootStore.appStore.toggleIsEditingListTitle(false);
            }
        }
    }

    changeInput(event: ChangeEvent) {
        let title = (event.target as HTMLInputElement).value;
        this.setState({title});
        if (this.props.rootStore.appStore.isEditingListTitle) {
            this.props.rootStore.appStore.selectedList.setTitle(title);
        }
    }

    cancelList() {
        this.props.rootStore.appStore.toggleIsCreatingNewList(false);
    }

    render() {
        return (
            <h3 className='list-title'>
                <input autoFocus={true}
                       type='text'
                       className='list-title list-title-input'
                       placeholder="New List Title"
                       onChange={this.changeInput}
                       onKeyUp={this.confirmList}
                       ref={input => this.input = input}
                       value={this.state.title}/>
                {this.props.rootStore.appStore.isCreatingNewList ?
                    <span onClick={this.cancelList}
                          className="fas fa-times-circle list-title-icon proto-list-option"
                    /> : null
                }
                <span onClick={this.confirmList} className='fas fa-check-circle list-title-icon proto-list-option'/>
            </h3>
        )
    }
}
