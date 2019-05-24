import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import {Provider} from "mobx-react";
import {rootStore} from "./stores/RootStore";

ReactDOM.render(
    <Provider rootStore={rootStore}>
        <App/>
    </Provider>,
    document.getElementById('root')
);