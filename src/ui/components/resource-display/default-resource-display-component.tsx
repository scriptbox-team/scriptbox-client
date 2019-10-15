import React from "react";
import Resource from "resource-management/resource";
import ResourceInfoComponent from "./resource-info-component";

interface DefaultResourceDisplayProperties {
    resource: Resource;
    onReupload: (resource: Resource) => void;
    onDelete: (resource: Resource) => void;
    onInfoChange: (kind: string, value: string) => void;
    onInfoSubmit: (kind: string, value: string) => void;
}

export default class DefaultResourceDisplayComponent extends React.Component<DefaultResourceDisplayProperties> {
    public render() {
        return <div className="resource-display-component">
            <ResourceInfoComponent
                name={this.props.resource.name}
                creator={this.props.resource.creator}
                description={this.props.resource.description}
                onInfoChange={this.props.onInfoChange}
                onInfoSubmit={this.props.onInfoSubmit}
            />
            <div className="resource-options">
                <button className="reupload-button" onClick={this._handleReupload}>Reupload</button>
                <button className="delete-button" onClick={this._handleDelete}>Delete</button>
            </div>
        </div>;
    }
    private _handleReupload = () => {
        this.props.onReupload(this.props.resource);
    }
    private _handleDelete = () => {
        this.props.onDelete(this.props.resource);
    }
}
