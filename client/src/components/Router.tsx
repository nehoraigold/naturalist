//region imports
import React from "react";
import {observer, inject} from "mobx-react";
import App from "./App";
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";
import Login from "./Login";
import TopMenu from "./TopMenu";
import Register from "./Register";

//endregion

@inject('rootStore')
@observer
class Router extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BrowserRouter>
                <TopMenu/>
                <Switch>
                    <Route className={this.props.rootStore.appStore.authenticated}
                           path="/login" render={() => this.props.rootStore.appStore.authenticated ?
                            <Redirect to="/"/> : <Login/> }/>
                    <Route className={this.props.rootStore.appStore.authenticated}
                           path="/register" render={() => this.props.rootStore.appStore.authenticated ?
                        <Redirect to="/"/> : <Register/>} />
                    <Route className={this.props.rootStore.appStore.authenticated}
                           path="/" render={() => this.props.rootStore.appStore.authenticated ?
                            <App/> : <Redirect to="/login"/>}/>
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Router;