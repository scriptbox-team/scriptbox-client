import React from "react";
import Resource from "resource-management/resource";

interface IImageDisplayProperties {
    resource: Resource;
    onReupload: (resource: Resource) => void;
    onDelete: (resource: Resource) => void;
}

export default class ImageDisplayComponent extends React.Component<IImageDisplayProperties> {
    public render() {
        return <div className="resource-display-component">
            <div className="resource-name">{this.props.resource.name}</div>
            <div className="resource-creator">{this.props.resource.creator}</div>
            <div className="resource-description">{this.props.resource.description}</div>
            <div className="resource-options">
                <button className="reupload-button" onClick={this.handleReupload}>Reupload</button>
                <button className="delete-button" onClick={this.handleDelete}>Delete</button>
            </div>
        </div>;
    }
    private handleReupload = () => {
        this.props.onReupload(this.props.resource);
    }
    private handleDelete = () => {
        this.props.onDelete(this.props.resource);
    }
}
