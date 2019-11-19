import React from "react";
import Resource, { ResourceType } from "resource-management/resource";
import DefaultResourceDisplayComponent from "./resource-display/default-resource-display-component";
import ImageDisplayComponent from "./resource-display/image-display-component";
import ScriptDisplayComponent from "./resource-display/script-display-component";
import SoundDisplayComponent from "./resource-display/sound-display-component";

interface ResourceDisplayProperties {
    resource: Resource;
    onReupload: (resource: Resource) => void;
    onDelete: (resource: Resource) => void;
    onSoundPlay: (resource: Resource) => void;
    onSoundStop: (resource: Resource) => void;
    onScriptRun: (resource: Resource, args: string) => void;
    onInfoChange: (resource: Resource, kind: string, value: string) => void;
    onInfoSubmit: (resource: Resource, kind: string, value: string) => void;
}

export default class ResourceDisplayComponent extends React.Component<ResourceDisplayProperties> {
    constructor(props: ResourceDisplayProperties) {
        super(props);
    }
    public render() {
        return <div className="resource-display"> {
            (() => {
                switch (this.props.resource.type) {
                    case ResourceType.Image: {
                        return <ImageDisplayComponent
                            resource={this.props.resource}
                            onReupload={this._onReupload}
                            onDelete={this._onDelete}
                            onInfoChange={this._onInfoChange}
                            onInfoSubmit={this._onInfoSubmit}
                        />;
                    }
                    case ResourceType.Sound: {
                        return <SoundDisplayComponent
                            resource={this.props.resource}
                            onReupload={this._onReupload}
                            onDelete={this._onDelete}
                            onPlay={this._onSoundPlay}
                            onStop={this._onSoundStop}
                            onInfoChange={this._onInfoChange}
                            onInfoSubmit={this._onInfoSubmit}
                        />;
                    }
                    case ResourceType.Script: {

                        return <ScriptDisplayComponent
                            resource={this.props.resource}
                            onEdit={this._onReupload}
                            onDelete={this._onDelete}
                            onRun={this._onScriptRun}
                            onInfoChange={this._onInfoChange}
                            onInfoSubmit={this._onInfoSubmit}
                        />;
                    }
                    default: {

                        return <DefaultResourceDisplayComponent
                            resource={this.props.resource}
                            onReupload={this._onReupload}
                            onDelete={this._onDelete}
                            onInfoChange={this._onInfoChange}
                            onInfoSubmit={this._onInfoSubmit}
                        />;
                    }
                }
            })()
        }</div>;
    }
    private _onReupload = (resource: Resource) => {
        this.props.onReupload(resource);
    }

    private _onSoundPlay = (resource: Resource) => {
        this.props.onSoundPlay(resource);
    }

    private _onSoundStop = (resource: Resource) => {
        this.props.onSoundStop(resource);
    }

    private _onScriptRun = (resource: Resource, args: string) => {
        this.props.onScriptRun(resource, args);
    }

    private _onDelete = (resource: Resource) => {
        this.props.onDelete(resource);
    }

    private _onInfoChange = (type: string, value: string) => {
        this.props.onInfoChange(this.props.resource, type, value);
    }

    private _onInfoSubmit = (type: string, value: string) => {
        this.props.onInfoChange(this.props.resource, type, value);
    }
}
