import React from "react";
import Resource from "resource-management/resource";
import ResourceInfoComponent from "./resource-info-component";
import ResourceOptionsComponent from "./resource-options-component";

interface DefaultResourceDisplayProperties {
    resource: Resource;
    onInfoChange: (kind: string, value: string) => void;
    onInfoSubmit: (kind: string, value: string) => void;
    locked?: boolean;
}

/**
 * A component for displaying a generic resource's information.
 *
 * @export
 * @class DefaultResourceDisplayComponent
 * @extends {React.Component<DefaultResourceDisplayProperties>}
 */
export default class DefaultResourceDisplayComponent extends React.Component<DefaultResourceDisplayProperties> {
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
}
