//region imports
import React from "react";
import {observer, inject} from "mobx-react";
import App from "./App";
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";
import Login from "./Login";
import TopMenu from "./TopMenu";
import Register from "./Register";

//endregion

@inject('store')
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
                    <Route className={this.props.store.authenticated}
                           path="/login" render={() => this.props.store.authenticated ?
                            <Redirect to="/"/> : <Login/> }/>
                    <Route className={this.props.store.authenticated}
                           path="/register" render={() => this.props.store.authenticated ?
                        <Redirect to="/"/> : <Register/>} />
                    <Route className={this.props.store.authenticated}
                           path="/" render={() => this.props.store.authenticated ?
                            <App/> : <Redirect to="/login"/>}/>
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Router;