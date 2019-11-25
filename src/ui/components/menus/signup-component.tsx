import React from "react";

import NamedImageButtonComponent from "../named-image-button-component";
import TextEntryComponent from "../text-entry-component";

interface SignupProperties {
    onLogin: () => void;
    onSignup: (username: string, email: string, password: string, passwordAgain: string) => void;
    status: string;
}

interface SignupState {
    username: string;
    email: string;
    password: string;
    passwordAgain: string;
}

export default class SignupComponent extends React.Component<SignupProperties, SignupState> {
    constructor(props: SignupProperties) {
        super(props);
        this._changeUsername = this._changeUsername.bind(this);
        this._changePassword = this._changePassword.bind(this);
        this._changeEmail = this._changeEmail.bind(this);
        this._changeReenteredPassword = this._changeReenteredPassword.bind(this);
        this._login = this._login.bind(this);
        this._signup = this._signup.bind(this);
        this.state = {username: "", email: "", password: "", passwordAgain: ""};
    }
    public render() {
        return <div className="signup-window">
            <TextEntryComponent
                class="username-entry"
                value={this.state.username}
                onChange={this._changeUsername}
            />
            <TextEntryComponent
                class="email-entry"
                value={this.state.email}
                onChange={this._changeEmail}
            />
            <TextEntryComponent
                class="password-entry"
                value={this.state.password}
                onChange={this._changePassword}
                hide
            />
            <TextEntryComponent
                class="password-entry"
                value={this.state.passwordAgain}
                onChange={this._changeReenteredPassword}
                hide
            />
            <span className="status">{this.props.status}</span>
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
    private _changeEmail(email: string) {
        this.setState({email});
    }
    private _changePassword(password: string) {
        this.setState({password});
    }
    private _changeReenteredPassword(passwordAgain: string) {
        this.setState({passwordAgain});
    }
    private _login() {
        this.props.onLogin();
    }
    private _signup() {
        this.props.onSignup(this.state.username, this.state.email, this.state.password, this.state.passwordAgain);
    }
}
