import React from "react";
import Resource from "resource-management/resource";
import ResourceInfoComponent from "./resource-info-component";
import ResourceOptionsComponent from "./resource-options-component";

interface ImageDisplayProperties {
    resource: Resource;
    onInfoChange: (kind: string, value: string) => void;
    onInfoSubmit: (kind: string, value: string) => void;
    locked?: boolean;
}

/**
 * A component for displaying an iamge resource's information.
 *
 * @export
 * @class ImageDisplayComponent
 * @extends {React.Component<ImageDisplayProperties>}
 */
export default class ImageDisplayComponent extends React.Component<ImageDisplayProperties> {
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
