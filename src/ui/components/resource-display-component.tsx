import React from "react";
import Resource, { ResourceType } from "resource-management/resource";
import ResourceOption from "resource-management/resource-option";
import DefaultDisplayComponent from "./resource-display/default-display-component";
import ImageDisplayComponent from "./resource-display/image-display-component";
import ScriptDisplayComponent from "./resource-display/script-display-component";
import SoundDisplayComponent from "./resource-display/sound-display-component";

interface IResourceDisplayProperties {
    resource: Resource;
    onOptionUpdate: (option: ResourceOption, newValue: string) => void;
    onReupload: (resource: Resource) => void;
    onDelete: (resource: Resource) => void;
    onSoundPlay: (resource: Resource) => void;
    onSoundStop: (resource: Resource) => void;
    onScriptRun: (resource: Resource, args: string) => void;
}

export default class ResourceDisplayComponent extends React.Component<IResourceDisplayProperties> {
    constructor(props: IResourceDisplayProperties) {
        super(props);
    }
    public render() {
        return <div className="resource-display"> {
            (() => {
                switch (this.props.resource.type) {
                    case ResourceType.Image: {
                        return <ImageDisplayComponent
                            resource={this.props.resource}
                            onReupload={this.onReupload}
                            onDelete={this.onDelete}
                        />;
                    }
                    case ResourceType.Sound: {
                        return <SoundDisplayComponent
                            resource={this.props.resource}
                            onReupload={this.onReupload}
                            onDelete={this.onDelete}
                            onPlay={this.onSoundPlay}
                            onStop={this.onSoundStop}
                        />;
                    }
                    case ResourceType.Script: {

                        return <ScriptDisplayComponent
                            resource={this.props.resource}
                            onEdit={this.onReupload}
                            onDelete={this.onDelete}
                            onRun={this.onScriptRun}
                        />;
                    }
                    default: {

                        return <DefaultDisplayComponent
                            resource={this.props.resource}
                            onReupload={this.onReupload}
                            onDelete={this.onDelete}
                        />;
                    }
                }
            })()
        }</div>;
    }
    private onChange = (option: ResourceOption, newValue: string) => {
        this.props.onOptionUpdate(option, newValue);
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
