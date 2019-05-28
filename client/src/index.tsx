//region imports
import React from "react";
import ReactDOM from "react-dom";
import Router from "./components/Router";
import {Provider} from "mobx-react";
import {rootStore} from "./stores/RootStore";
//endregion

function ready() {
    ReactDOM.render(
        <Provider rootStore={rootStore}>
            <Router/>
        </Provider>,
        document.getElementById('root')
    );
}

ready();