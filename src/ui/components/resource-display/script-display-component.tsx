import React from "react";
import Resource from "resource-management/resource";
import TextEntryComponent from "../text-entry-component";
import ResourceInfoComponent from "./resource-info-component";

interface ScriptDisplayProperties {
    resource: Resource;
    onRun: (resource: Resource, args: string) => void;
    onEdit: (resource: Resource) => void;
    onDelete: (resource: Resource) => void;
    onInfoChange: (kind: string, value: string) => void;
    onInfoSubmit: (kind: string, value: string) => void;
}

interface ScriptDisplayState {
    args: string;
}

export default class ScriptDisplayComponent extends React.Component<ScriptDisplayProperties, ScriptDisplayState> {
    constructor(props: ScriptDisplayProperties) {
        super(props);
        this.state = {args: ""};
    }
    public render() {
        return <div className="resource-display-component">
            <ResourceInfoComponent
                id={this.props.resource.id}
                name={this.props.resource.name}
                creator={this.props.resource.creator}
                description={this.props.resource.description}
                onInfoChange={this.props.onInfoChange}
                onInfoSubmit={this.props.onInfoSubmit}
            />
            <div className="resource-options">
                Execution Arguments: <TextEntryComponent
                    class="argument-text-entry"
                    value={this.state.args}
                    onChange={(newValue) => this.setState({args: newValue})}
                    onSubmit={() => {}}
                />
                <button className="run-button" onClick={this._handleRun}>Run</button>
                <button className="edit-button" onClick={this._handleEdit}>Edit</button>
                <button className="delete-button" onClick={this._handleDelete}>Delete</button>
            </div>
        </div>;
    }
    private _handleRun = () => {
        this.props.onRun(this.props.resource, this.state.args);
    }
    private _handleEdit = () => {
        this.props.onEdit(this.props.resource);
    }
    private _handleDelete = () => {
        this.props.onDelete(this.props.resource);
    }
}
