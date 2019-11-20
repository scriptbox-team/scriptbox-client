import React from "react";
import Resource from "resource-management/resource";
import TextEntryComponent from "../text-entry-component";
import ResourceInfoComponent from "./resource-info-component";

interface ScriptDisplayProperties {
    resource: Resource;
    onInfoChange: (kind: string, value: string) => void;
    onInfoSubmit: (kind: string, value: string) => void;
    locked?: boolean;
}

export default class ScriptDisplayComponent extends React.Component<ScriptDisplayProperties> {
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
            </div>
        </div>;
    }
}
