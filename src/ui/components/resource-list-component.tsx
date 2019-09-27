import React from "react";
import Resource from "resource-management/resource";
import GridListComponent from "./grid-list-component";
import ResourceDisplayComponent from "./resource-display-component";

interface IResourceListProperties {
    resources: Resource[];
    onReupload: (resource: Resource) => void;
    onDelete: (resource: Resource) => void;
    onSoundPlay: (resource: Resource) => void;
    onSoundStop: (resource: Resource) => void;
    onScriptRun: (resource: Resource, args: string) => void;
    onInfoChange: (resource: Resource, kind: string, value: string) => void;
    onInfoSubmit: (resource: Resource, kind: string, value: string) => void;
    onResourceChange: (resourceID?: string) => void;
    selectedResourceID?: string;
}

export default class ResourceListComponent extends React.Component<IResourceListProperties> {
    constructor(props: IResourceListProperties) {
        super(props);
        this.setResource = this.setResource.bind(this);
    }
    public render() {
        return <div className="resource-list">
            <GridListComponent
                class="resource-select"
                direction="horizontal"
                resources={this.props.resources}
                onClick={this.setResource}
            >
            {this.props.children}
            </GridListComponent>
            {(() => {
                if (this.props.selectedResourceID !== undefined) {
                    const resource = this.getResource(this.props.selectedResourceID);
                    if (resource !== undefined) {
                        return <ResourceDisplayComponent
                            resource={resource}
                            onReupload={this.onReupload}
                            onDelete={this.onDelete}
                            onSoundPlay={this.onSoundPlay}
                            onSoundStop={this.onSoundStop}
                            onScriptRun={this.onScriptRun}
                            onInfoChange={this.props.onInfoChange}
                            onInfoSubmit={this.props.onInfoSubmit}
                        />;
                    }
                }
                return <div className="resource-display">Choose a resource to inspect.</div>;
            })()}
        </div>;
    }
    private setResource(id?: string) {
        this.props.onResourceChange(id);
    }
    private getResource(id: string) {
        return this.props.resources.find((res) => res.id === id);
    }
    private onReupload = (resource: Resource) => {
        this.props.onReupload(resource);
    }

    private onSoundPlay = (resource: Resource) => {
        this.props.onSoundPlay(resource);
    }

    private onSoundStop = (resource: Resource) => {
        this.props.onSoundStop(resource);
    }

    private onScriptRun = (resource: Resource, args: string) => {
        this.props.onScriptRun(resource, args);
    }

    private onDelete = (resource: Resource) => {
        this.props.onDelete(resource);
    }
}
