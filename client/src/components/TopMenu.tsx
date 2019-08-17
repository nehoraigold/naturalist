//region imports
import * as React from "react";
import {observer, inject} from "mobx-react";
import "../css/TopMenu.css";
import {Link} from "react-router-dom";
import {Theme} from "../types/enums/Theme";

//endregion

@inject('store')
@observer
class TopMenu extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.renderThemeBoxes = this.renderThemeBoxes.bind(this);
        this.changeTheme = this.changeTheme.bind(this);
        this.logout = this.logout.bind(this);
    }

    changeTheme(e: any) {
        const newTheme = e.target.classList[1];
        this.props.store.setTheme(newTheme);
    }

    logout() {
        this.props.store.logoutAndWipeData();
    }

    renderThemeBoxes(): any {
        return Object.keys(Theme).map((theme: string) =>
            <div key={theme}
                 onClick={this.changeTheme}
                 className={`theme-box ${theme}`}
            />);
    }

    render() {
        return (
            <div className='top-menu'>
                <span className='header'>
                    <Link to="/" className='logo'>
                        <span className="fas fa-leaf"/>
                        NaturaList
                    </Link>
                </span>
                {this.props.store.authenticated ?
                    <a onClick={this.logout}>Logout</a> :
                    <Link to={"/register"} className={"register"}>Sign up</Link>}
                <div className='themes'>
                    <span className='themes-label'> Themes </span>
                    <div
                        className='theme-boxes'>
                        {this.renderThemeBoxes()}
                    </div>
                </div>
            </div>
        )
    }
}

export default TopMenu;