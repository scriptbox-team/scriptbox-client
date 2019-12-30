import React from "react";

import NamedImageButtonComponent from "../named-image-button-component";
import TextEntryComponent from "../text-entry-component";

interface ConnectProperties {
    onConnect: (ip: string) => void;
}

interface ConnectState {
    ip: string;
}

/**
 * A react component for the connection window
 *
 * @export
 * @class ConnectComponent
 * @extends {React.Component<ConnectProperties, ConnectState>}
 */
export default class ConnectComponent extends React.Component<ConnectProperties, ConnectState> {
    constructor(props: ConnectProperties) {
        super(props);
        this._changeIP = this._changeIP.bind(this);
        this._connect = this._connect.bind(this);
        this.state = {ip: ""};
    }
    public render() {
        return <div className="connect-window">
            <TextEntryComponent
                class="ip-entry"
                value={this.state.ip}
                onChange={this._changeIP}
            />
            <NamedImageButtonComponent
                id="connect"
                class="connect-button"
                image=""
                name="Connect"
                onClick={this._connect}
            />
        </div>;
    }
    private _changeIP(ip: string) {
        this.setState({ip});
    }
    private _connect() {
        this.props.onConnect(this.state.ip);
    }
}
