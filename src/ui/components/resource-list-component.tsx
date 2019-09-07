import React from "react";
import Resource from "resource-management/resource";
import ResourceOption from "resource-management/resource-option";
import GridListComponent from "./grid-list-component";
import ResourceDisplayComponent from "./resource-display-component";

interface IResourceListProperties {
    resources: Resource[];
    onOptionUpdate: (resource: Resource, option: ResourceOption, newVal: string) => void;
    onReupload: (resource: Resource) => void;
    onDelete: (resource: Resource) => void;
    onSoundPlay: (resource: Resource) => void;
    onSoundStop: (resource: Resource) => void;
    onScriptRun: (resource: Resource, args: string) => void;
}

interface IResourceListState {
    selectedResource?: Resource;
}

export default class ResourceListComponent extends React.Component<IResourceListProperties, IResourceListState> {
    constructor(props: IResourceListProperties) {
        super(props);
        this.state = {selectedResource: undefined};
        this.setResource = this.setResource.bind(this);
        this.reportOptionUpdate = this.reportOptionUpdate.bind(this);
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
                if (this.state.selectedResource !== undefined) {
                    return <ResourceDisplayComponent
                        resource={this.state.selectedResource}
                        onOptionUpdate={this.reportOptionUpdate}
                        onReupload={this.onReupload}
                        onDelete={this.onDelete}
                        onSoundPlay={this.onSoundPlay}
                        onSoundStop={this.onSoundStop}
                        onScriptRun={this.onScriptRun}
                    />;
                }
                return <div className="resource-display">Choose a resource to inspect.</div>;
            })()}
        </div>;
    }
    private setResource(id: string) {
        this.setState({selectedResource: this.props.resources.find((res) => res.id === id)});
    }
    private reportOptionUpdate(option: ResourceOption, newVal: string) {
        this.props.onOptionUpdate(this.state.selectedResource!, option, newVal);
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
