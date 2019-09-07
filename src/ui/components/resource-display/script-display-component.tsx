import React from "react";
import Resource from "resource-management/resource";
import TextEntryComponent from "../text-entry-component";

interface IScriptDisplayProperties {
    resource: Resource;
    onRun: (resource: Resource, args: string) => void;
    onEdit: (resource: Resource) => void;
    onDelete: (resource: Resource) => void;
}

interface IScriptDisplayState {
    args: string;
}

export default class ScriptDisplayComponent extends React.Component<IScriptDisplayProperties, IScriptDisplayState> {
    constructor(props: IScriptDisplayProperties) {
        super(props);
        this.state = {args: ""};
    }
    public render() {
        return <div className="resource-display-component">
            <div className="resource-name">{this.props.resource.name}</div>
            <div className="resource-creator">{this.props.resource.creator}</div>
            <div className="resource-description">{this.props.resource.description}</div>
            <div className="resource-options">
                Execution Arguments: <TextEntryComponent
                    class="argument-text-entry"
                    value={this.state.args}
                    onChange={(newValue) => this.setState({args: newValue})}
                    onEnterKey={() => {}}
                />
                <button className="run-button" onClick={this.handleRun}>Run</button>
                <button className="edit-button" onClick={this.handleEdit}>Edit</button>
                <button className="delete-button" onClick={this.handleDelete}>Delete</button>
            </div>
        </div>;
    }
    private handleRun = () => {
        this.props.onRun(this.props.resource, this.state.args);
    }
    private handleEdit = () => {
        this.props.onEdit(this.props.resource);
    }
    private handleDelete = () => {
        this.props.onDelete(this.props.resource);
    }
}
