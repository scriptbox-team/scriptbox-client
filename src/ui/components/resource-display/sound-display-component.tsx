import React from "react";
import Resource from "resource-management/resource";
import ResourceInfoComponent from "./resource-info-component";

interface SoundDisplayProperties {
    resource: Resource;
    onPlay: (resource: Resource) => void;
    onStop: (resource: Resource) => void;
    onInfoChange: (kind: string, value: string) => void;
    onInfoSubmit: (kind: string, value: string) => void;
    locked?: boolean;
}

export default class SoundDisplayComponent extends React.Component<SoundDisplayProperties> {
    public render() {
        return <div className="resource-display-component">
            <ResourceInfoComponent
                id={this.props.resource.id}
                name={this.props.resource.name}
                filename={this.props.resource.filename}
                creator={this.props.resource.creator}
                description={this.props.resource.description}
                onInfoChange={this.props.onInfoChange}
                onInfoSubmit={this.props.onInfoSubmit}
            />
        </div>;
    }
    private _handlePlay = () => {
        this.props.onPlay(this.props.resource);
    }
    private _handleStop = () => {
        this.props.onStop(this.props.resource);
    }
}
