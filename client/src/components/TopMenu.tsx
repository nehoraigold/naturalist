//region imports
import * as React from "react";
import { observer, inject } from "mobx-react";
import "../css/TopMenu.css";
import { Link } from "react-router-dom";
import { Theme } from "../types/enums/Theme";

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
            <div key={`${theme}-option`} className={`theme-box ${theme}`} onClick={this.changeTheme}>
                {theme.toString()}
            </div>
        );
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
                <div className="right-menu">
                    {this.props.store.authenticated ?
                        <a className={"logout menu-link"} onClick={this.logout}>Logout</a> :
                        <React.Fragment>
                            <Link to={"/register"} className={"register menu-link"}>Sign up</Link>
                            <Link to={"/login"} className={"login menu-link"}>Log in</Link>
                        </React.Fragment>}
                    <span className='theme-submenu'>
                        <span className='themes-label menu-link'>Themes</span>
                        <div className='themes'>
                            {this.renderThemeBoxes()}
                        </div>
                    </span>
                </div>
            </div>
        )
    }
}

export default TopMenu;