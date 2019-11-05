import * as React from "react";
import * as ReactDOM from "react-dom";

import ConnectComponent from "./components/menus/connect-component";
import LoginComponent from "./components/menus/login-component";
import UIElementComponent from "./components/ui-element-component";
import LoginUI from "./login-ui";

export default class LoginUIPure extends LoginUI {
    private _currentMenu: string = "login";
    constructor() {
        super();
        this._login = this._login.bind(this);
        this._connect = this._connect.bind(this);
    }
    public render() {
        let elems: Array<React.ComponentElement<any, any>> = [];
        switch (this._currentMenu) {
            case "login":
            case "signup": {
                elems = [
                    React.createElement(UIElementComponent,
                        {
                            key: "login-window",
                            class: "login-window"
                        },
                        React.createElement(
                            LoginComponent,
                            {
                                onLogin: this._login,
                                onSignup: () => {}
                            },
                            []
                        )
                    )
                ];
                break;
            }
            case "signup": {
                break;
            }
            case "connect": {
                elems = [
                    React.createElement(UIElementComponent,
                        {
                            key: "connect-window",
                            class: "connect-window"
                        },
                        React.createElement(
                            ConnectComponent,
                            {
                                onConnect: this._connect
                            },
                            []
                        )
                    )
                ];
                break;
            }
        }

        ReactDOM.render(
            React.createElement("div",
                {className: "uiElements"},
                elems,
                null
            ),
            document.getElementById("ui")
        );
    }
    public setMenu(menu: string) {
        this._currentMenu = menu;
    }
    private _login(username: string, password: string) {
        // Temporary code
        // Eventually this should interface with the login server
        this.onLogin(username, password);
    }
    private _signup(username: string, email: string, password: string, passwordDupe: string) {
        if (password === passwordDupe) {
            this.onSignup(username, email, password);
        }
        else {
            // TODO: Output some kind of error that the passwords did not match
        }
    }

    private _connect(server: string) {
        this.onConnect(server);
    }
}
