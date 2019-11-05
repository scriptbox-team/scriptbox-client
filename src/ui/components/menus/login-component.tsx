import React from "react";

import NamedImageButtonComponent from "../named-image-button-component";
import TextEntryComponent from "../text-entry-component";

interface LoginProperties {
    onLogin: (username: string, password: string) => void;
    onSignup: () => void;
}

interface LoginState {
    username: string;
    password: string;
}

export default class LoginComponent extends React.Component<LoginProperties, LoginState> {
    constructor(props: LoginProperties) {
        super(props);
        this._changeUsername = this._changeUsername.bind(this);
        this._changePassword = this._changePassword.bind(this);
        this._login = this._login.bind(this);
        this._signup = this._signup.bind(this);
        this.state = {username: "", password: ""};
    }
    public render() {
        return <div className="login-window">
            <TextEntryComponent
                class="username-entry"
                value={this.state.username}
                onChange={this._changeUsername}
            />
            <TextEntryComponent
                class="password-entry"
                value={this.state.password}
                onChange={this._changePassword}
                hide
            />
            <NamedImageButtonComponent
                id="login"
                image=""
                name="Login"
                onClick={this._login}
            />
            <NamedImageButtonComponent
                id="signup"
                image=""
                name="Sign Up"
                onClick={this._signup}
            />
        </div>;
    }
    private _changeUsername(username: string) {
        this.setState({username});
    }
    private _changePassword(password: string) {
        this.setState({password});
    }
    private _login() {
        this.props.onLogin(this.state.username, this.state.password);
    }
    private _signup() {
        this.props.onSignup();
    }
}
