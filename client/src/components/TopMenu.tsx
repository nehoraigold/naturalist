//region imports
import * as React from "react";
import {observer, inject} from "mobx-react";
import "../css/TopMenu.css";
import {Link} from "react-router-dom";

//endregion

@inject('rootStore')
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
        this.props.rootStore.appStore.setTheme(newTheme);
    }

    logout() {
        //TODO: actually implement this
        this.props.rootStore.logoutAndWipeData();
    }

    renderThemeBoxes(): any {
        return this.props.rootStore.appStore.ALL_THEMES.map((theme: string) =>
            <div key={theme}
                 onClick={this.changeTheme}
                 className={`theme-box ${theme}`}
            />);
    }

    render() {
        return (
            <div className='top-menu'>
                <span className='header'>
                    <span className='logo'>
                        <span className="fas fa-leaf"/>
                        NaturaList
                    </span>
                </span>
                {this.props.rootStore.appStore.authenticated ?
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