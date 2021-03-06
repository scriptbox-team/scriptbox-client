import * as React from "react";
import TextEntryComponent from "../text-entry-component";

interface ResourceInfoProperties {
    id: string;
    name: string;
    filename: string;
    creator: string;
    description: string;
    onInfoChange: (kind: string, newValue: string) => void;
    onInfoSubmit: (kind: string, newValue: string) => void;
    locked?: boolean;
}

/**
 * A component for displaying the meta information of a resource.
 *
 * @export
 * @class ResourceInfoComponent
 * @extends {React.Component<ResourceInfoProperties>}
 */
export default class ResourceInfoComponent extends React.Component<ResourceInfoProperties> {
    public render() {
        return <div className="resource-info">
            <TextEntryComponent
                class="resource-name"
                value={this.props.name}
                onChange={(newVal) => this.props.onInfoChange("name", newVal)}
                onSubmit={(newVal) => this.props.onInfoSubmit("name", newVal)}
                submitOnUnfocus
                submitOnEnter
                pretty
                readonly={this.props.locked}
            /> ID: {this.props.id}
            <TextEntryComponent
                class="resource-filename"
                value={this.props.filename}
                onChange={(newVal) => this.props.onInfoChange("filename", newVal)}
                onSubmit={(newVal) => this.props.onInfoSubmit("filename", newVal)}
                submitOnUnfocus
                submitOnEnter
                pretty
                readonly={this.props.locked}
            />
            <div className="resource-creator">Created by {this.props.creator}</div>
            <TextEntryComponent
                class="resource-description"
                value={this.props.description}
                onChange={(newVal) => this.props.onInfoChange("description", newVal)}
                onSubmit={(newVal) => this.props.onInfoSubmit("description", newVal)}
                submitOnUnfocus
                multiline
                pretty
                readonly={this.props.locked}
            />
        </div>;
    }
}
