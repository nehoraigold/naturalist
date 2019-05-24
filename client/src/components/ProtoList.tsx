//region imports
import React from "react";
import "../css/ProtoList.css"
import {ChangeableListTitle} from "./ChangeableListTitle";

//endregion

function ProtoList() {
    return (
        <div className='list'>
            <ChangeableListTitle/>
            <div className='alert alert-danger' role='alert'>
                You must save your new list before adding tasks.
            </div>
        </div>
    )
}

export default ProtoList;