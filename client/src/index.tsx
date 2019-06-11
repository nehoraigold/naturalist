//region imports
import React from "react";
import ReactDOM from "react-dom";
import Router from "./components/Router";
import {Provider} from "mobx-react";
import {store} from "./stores/Store";
//endregion

function ready() {
    ReactDOM.render(
        <Provider store={store}>
            <Router/>
        </Provider>,
        document.getElementById('root')
    );
}

ready();