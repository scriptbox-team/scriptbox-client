import React from "react";
import Resource from "resource-management/resource";

interface ISoundDisplayProperties {
    resource: Resource;
    onPlay: (resource: Resource) => void;
    onStop: (resource: Resource) => void;
    onReupload: (resource: Resource) => void;
    onDelete: (resource: Resource) => void;
}

export default class SoundDisplayComponent extends React.Component<ISoundDisplayProperties> {
    public render() {
        return <div className="resource-display-component">
            <div className="resource-name">{this.props.resource.name}</div>
            <div className="resource-creator">{this.props.resource.creator}</div>
            <div className="resource-description">{this.props.resource.description}</div>
            <div className="resource-options">
                <button className="play-button" onClick={this.handlePlay}>Play</button>
                <button className="stop-button" onClick={this.handleStop}>Stop</button>
                <button className="reupload-button" onClick={this.handleReupload}>Reupload</button>
                <button className="delete-button" onClick={this.handleDelete}>Delete</button>
            </div>
        </div>;
    }
    private handlePlay = () => {
        this.props.onPlay(this.props.resource);
    }
    private handleStop = () => {
        this.props.onStop(this.props.resource);
    }
    private handleReupload = () => {
        this.props.onReupload(this.props.resource);
    }
    private handleDelete = () => {
        this.props.onDelete(this.props.resource);
    }
}
