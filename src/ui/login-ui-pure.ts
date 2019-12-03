import * as React from "react";
import * as ReactDOM from "react-dom";

import ConnectComponent from "./components/menus/connect-component";
import LoginComponent from "./components/menus/login-component";
import SignupComponent from "./components/menus/signup-component";
import UIElementComponent from "./components/ui-element-component";
import LoginUI from "./login-ui";

export default class LoginUIPure extends LoginUI {
    private _currentMenu: string = "login";
    private _statusMessage: string = "";
    constructor() {
        super();
        this._login = this._login.bind(this);
        this._signup = this._signup.bind(this);
        this._loginAttempt = this._loginAttempt.bind(this);
        this._connect = this._connect.bind(this);
    }
    public render() {
        let elems: Array<React.ComponentElement<any, any>> = [];
        switch (this._currentMenu) {
            case "login": {
                elems = [
                    React.createElement(UIElementComponent,
                        {
                            key: "login-window",
                            class: "login-window"
                        },
                        React.createElement(
                            LoginComponent,
                            {
                                onLogin: this._loginAttempt,
                                onSignup: () => this._currentMenu = "signup",
                                status: this._statusMessage
                            },
                            []
                        )
                    )
                ];
                break;
            }
            case "signup": {
                elems = [
                    React.createElement(UIElementComponent,
                        {
                            key: "login-window",
                            class: "login-window"
                        },
                        React.createElement(
                            SignupComponent,
                            {
                                onSignup: this._signup,
                                onLogin: () => this._currentMenu = "login",
                                status: this._statusMessage
                            },
                            []
                        )
                    )
                ];
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
    public setStatus(status: string) {
        this._statusMessage = status;
    }
    public login(token: string) {
        this._login(token);
    }
    private _login(token: string) {
        // Temporary code
        // Eventually this should interface with the login server
        this.onLogin(token);
    }
    private _loginAttempt(username: string, password: string) {
        // Temporary code
        // Eventually this should interface with the login server
        this.onLoginAttempt(username, password);
    }
    private _signup(username: string, email: string, password: string, passwordDupe: string) {
        if (password === passwordDupe) {
            this.onSignup(username, email, password);
        }
        else {
            this.setStatus("Passwords did not match");
            // TODO: Output some kind of error that the passwords did not match
        }
    }

    private _connect(server: string) {
        this.onConnect(server);
    }
}
