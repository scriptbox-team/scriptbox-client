import React from "react";
import Resource from "resource-management/resource";

import TextEntryComponent from "../text-entry-component";

interface ScriptOptionsProperties {
    resource: Resource;
    onRun: (resource: Resource, args: string) => void;
    onEdit: (resource: Resource) => void;
}

interface ScriptDisplayState {
    args: string;
}

export default class ScriptOptionsComponent extends React.Component<ScriptOptionsProperties, ScriptDisplayState> {
    constructor(props: ScriptOptionsProperties) {
        super(props);
        this.state = {args: ""};
    }
    public render() {
        return <div>
            Execution Arguments: <TextEntryComponent
                class="argument-text-entry"
                value={this.state.args}
                onChange={(newValue) => this.setState({args: newValue})}
                onSubmit={() => {}}
            />
            <button className="run-button" onClick={this._handleRun}>Run</button>
            <button className="edit-button" onClick={this._handleEdit}>Edit</button>
        </div>;
    }
    private _handleRun = () => {
        this.props.onRun(this.props.resource, this.state.args);
    }
    private _handleEdit = () => {
        this.props.onEdit(this.props.resource);
    }
}
