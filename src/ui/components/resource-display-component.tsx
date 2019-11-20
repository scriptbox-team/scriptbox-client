import React from "react";
import Resource, { ResourceType } from "resource-management/resource";

import DefaultResourceDisplayComponent from "./resource-display/default-resource-display-component";
import ImageDisplayComponent from "./resource-display/image-display-component";
import ResourceOptionsComponent from "./resource-display/resource-options-component";
import ScriptDisplayComponent from "./resource-display/script-display-component";
import ScriptOptionsComponent from "./resource-display/script-options-component";
import SoundDisplayComponent from "./resource-display/sound-display-component";

interface ResourceDisplayProperties {
    resource: Resource;
    onReupload: (resource: Resource) => void;
    onDelete: (resource: Resource) => void;
    onSoundPlay: (resource: Resource) => void;
    onSoundStop: (resource: Resource) => void;
    onScriptEdit: (resource: Resource) => void;
    onScriptRun: (resource: Resource, args: string) => void;
    onInfoChange: (resource: Resource, kind: string, value: string) => void;
    onInfoSubmit: (resource: Resource, kind: string, value: string) => void;
    onClone?: (resource: Resource) => void;
    shared?: boolean;
}

export default class ResourceDisplayComponent extends React.Component<ResourceDisplayProperties> {
    constructor(props: ResourceDisplayProperties) {
        super(props);
    }
    public render() {
        return <div className="resource-display">
            {(() => {
                switch (this.props.resource.type) {
                    case ResourceType.Image: {
                        return <ImageDisplayComponent
                            resource={this.props.resource}
                            onInfoChange={this._onInfoChange}
                            onInfoSubmit={this._onInfoSubmit}
                            locked={this.props.shared}
                        />;
                    }
                    case ResourceType.Sound: {
                        return <SoundDisplayComponent
                            resource={this.props.resource}
                            onPlay={this._onSoundPlay}
                            onStop={this._onSoundStop}
                            onInfoChange={this._onInfoChange}
                            onInfoSubmit={this._onInfoSubmit}
                            locked={this.props.shared}
                        />;
                    }
                    case ResourceType.Script: {
                        return <ScriptDisplayComponent
                            resource={this.props.resource}
                            onInfoChange={this._onInfoChange}
                            onInfoSubmit={this._onInfoSubmit}
                            locked={this.props.shared}
                        />;
                    }
                    default: {
                        return <DefaultResourceDisplayComponent
                            resource={this.props.resource}
                            onInfoChange={this._onInfoChange}
                            onInfoSubmit={this._onInfoSubmit}
                            locked={this.props.shared}
                        />;
                    }
                }
            })()}
            {(() => {
                if (this.props.resource.type === ResourceType.Script && !this.props.shared) {
                    return <ScriptOptionsComponent
                        resource={this.props.resource}
                        onEdit={this._onScriptEdit}
                        onRun={this._onScriptRun}
                    />;
                }
            })()}
            {(() => {
                if (!this.props.shared) {
                    return <ResourceOptionsComponent
                        resource={this.props.resource}
                        onReupload={this._onReupload}
                        onDelete={this._onDelete}
                        onShareChange={this._onShareChange}
                    />;
                }
                else {
                    return <button
                        className="clone-button"
                        onClick={() => this._onClone(this.props.resource)}
                    >Clone</button>;
                }
            })()
            }
        </div>;
    }
    private _onReupload = () => {
        this.props.onReupload(this.props.resource);
    }

    private _onScriptEdit = (resource: Resource) => {
        this.props.onScriptEdit(resource);
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

    private _onDelete = () => {
        this.props.onDelete(this.props.resource);
    }

    private _onInfoChange = (type: string, value: string) => {
        this.props.onInfoChange(this.props.resource, type, value);
    }

    private _onInfoSubmit = (type: string, value: string) => {
        this.props.onInfoSubmit(this.props.resource, type, value);
    }
    private _onShareChange = (shared: boolean) => {
        this.props.onInfoSubmit(this.props.resource, "shared", shared ? "true" : "false");
    }

    private _onClone = (resource: Resource) => {
        if (this.props.onClone !== undefined) {
            this.props.onClone(resource);
        }
    }
}
