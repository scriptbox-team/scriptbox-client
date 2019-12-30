import * as React from "react";
import * as ReactDOM from "react-dom";

import ConnectComponent from "./components/menus/connect-component";
import LoginComponent from "./components/menus/login-component";
import SignupComponent from "./components/menus/signup-component";
import TitleComponent from "./components/title-component";
import UIElementComponent from "./components/ui-element-component";
import LoginUI from "./login-ui";

/**
 * The browser side of the login UI.
 * This uses react to render the login UI.
 *
 * @export
 * @class LoginUIPure
 * @extends {LoginUI}
 */
export default class LoginUIPure extends LoginUI {
    private _currentMenu: string = "login";
    private _statusMessage: string = "";
    /**
     * Creates an instance of LoginUIPure.
     * @memberof LoginUIPure
     */
    constructor() {
        super();
        this._login = this._login.bind(this);
        this._signup = this._signup.bind(this);
        this._loginAttempt = this._loginAttempt.bind(this);
        this._connect = this._connect.bind(this);
    }
    /**
     * Render the UI screen.
     *
     * @memberof LoginUIPure
     */
    public render() {
        let elems: Array<React.ComponentElement<any, any>> = [
            React.createElement(TitleComponent,
                {
                    title: "Scriptbox"
                }
            )
        ];
        switch (this._currentMenu) {
            case "login": {
                elems = elems.concat([
                    React.createElement(UIElementComponent,
                        {
                            key: "login-element",
                            class: "login-element"
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
                ]);
                break;
            }
            case "signup": {
                elems = elems.concat([
                    React.createElement(UIElementComponent,
                        {
                            key: "signup-element",
                            class: "signup-element"
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
                ]);
                break;
            }
            case "connect": {
                elems = elems.concat([
                    React.createElement(UIElementComponent,
                        {
                            key: "connect-element",
                            class: "connect-element"
                        },
                        React.createElement(
                            ConnectComponent,
                            {
                                onConnect: this._connect
                            },
                            []
                        )
                    )
                ]);
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
    /**
     * Set the current menu of the login UI screen.
     *
     * @param {string} menu The name of the menu to switch to.
     * @memberof LoginUIPure
     */
    public setMenu(menu: string) {
        this._currentMenu = menu;
    }
    /**
     * Set the login status message.
     *
     * @param {string} newStatus The login status message to set.
     * @memberof LoginUIPure
     */
    public setStatus(status: string) {
        this._statusMessage = status;
    }
    /**
     * Proceed to the next screen after logging in
     *
     * @param {string} username The username logged in with.
     * @param {string} token The token received from the login server.
     * @memberof LoginUIPure
     */
    public login(username: string, token: string) {
        this._login(username, token);
    }
    /**
     * Proceed to the next screen after logging in
     *
     * @param {string} username The username logged in with.
     * @param {string} token The token received from the login server.
     * @memberof LoginUIPure
     */
    private _login(username: string, token: string) {
        // Temporary code
        // Eventually this should interface with the login server
        this.onLogin(username, token);
    }
    /**
     * Make a login attempt.
     *
     * @private
     * @param {string} username The username to log in with
     * @param {string} password The password to log in with
     * @memberof LoginUIPure
     */
    private _loginAttempt(username: string, password: string) {
        // Temporary code
        // Eventually this should interface with the login server
        this.onLoginAttempt(username, password);
    }
    /**
     * Send a sign up request.
     *
     * @private
     * @param {string} username The username to create the account with
     * @param {string} email The email to create the account with
     * @param {string} password The password of the account
     * @param {string} passwordDupe The password re-type
     * @memberof LoginUIPure
     */
    private _signup(username: string, email: string, password: string, passwordDupe: string) {
        if (password === passwordDupe) {
            this.onSignup(username, email, password);
        }
        else {
            this.setStatus("Passwords did not match");
            // TODO: Output some kind of error that the passwords did not match
        }
    }

    /**
     * Connect to a server.
     *
     * @private
     * @param {string} server The IP of the server to connect to.
     * @memberof LoginUIPure
     */
    private _connect(server: string) {
        this.onConnect(server);
    }
}
