import { DebugLogType, log } from "core/debug-logger";
import { ToolType } from "input/tool-type";
import * as React from "react";
import * as ReactDOM from "react-dom";
import ComponentInfo from "resource-management/component-info";
import ComponentOption from "resource-management/component-option";
import Resource, { ResourceType } from "resource-management/resource";

import ChatWindowComponent from "./components/chat-window-component";
import ComponentListComponent from "./components/component-list-component";
import FileUploaderComponent from "./components/file-uploader-component";
import NamedImageButtonComponent from "./components/named-image-button-component";
import ResourceListComponent from "./components/resource-list-component";
import TitledWindowComponent from "./components/titled-window.component";
import ToolButtonsComponent from "./components/tool-buttons-component";
import UIElementComponent from "./components/ui-element-component";
import UIManager from "./ui-manager";

// TODO: Replace arrow function properties [public blah = () => {}] with binds
// It turns out that this makes mocking more difficult, among other things

export default class UIManagerPure extends UIManager {
    private _messages: string[] = [];
    private _chatEntryVal: string = "";
    private _selectedTool: string = "edit";
    private _selectedResource?: string;
    private _resources: Resource[];
    private _entityData: ComponentInfo[];
    private _inspectedEntity?: string;
    private _modifiedAttributes: {[resourceID: string]: {[property: string]: string | undefined}};
    private _uploadWindowVisible: boolean = false;
    private _uploadID?: string;
    constructor() {
        super();
        this._resources = [];
        this._entityData = [];
        this._modifiedAttributes = {};
    }
    public render() {
        const elems = [
            React.createElement(UIElementComponent, {key: "chat", class: "chat"},
                React.createElement(
                    ChatWindowComponent,
                    {
                        chatEntryValue: this._chatEntryVal,
                        messages: this._messages,
                        onMessageEntryChange: (newChatEntryVal: string) => this._chatEntryVal = newChatEntryVal,
                        onMessageEntrySubmit: this.sendEnteredChatMessage
                    },
                    null
                ),
            ),
            React.createElement(UIElementComponent,
                {
                    key: "resources",
                    class: "resources"
                },
                React.createElement(
                    ResourceListComponent,
                    {
                        resources: this._resources,
                        onReupload: (resource: Resource) => {
                            this._uploadID = resource.id;
                            this.openFileUploadWindow();
                        },
                        onDelete: (resource: Resource) => {
                            this.reportResourceDeletion(resource.id);
                        },
                        onSoundPlay: (resource: Resource) => {},
                        onSoundStop: (resource: Resource) => {},
                        onScriptRun: (resource: Resource, args: string) => {
                            this.reportScriptRun(resource.id, args);
                        },
                        onInfoChange: (resource: Resource, kind: string, newValue: string) => {
                            this.resourcePropertyChanged(resource, kind, newValue);
                        },
                        onInfoSubmit: (resource: Resource, kind: string, newValue: string) => {
                            this.resourcePropertySubmit(resource, kind, newValue);
                        },
                        onResourceChange: (resourceID?: string) => {
                            this._selectedResource = resourceID;
                            console.log(`resource changed to ${this._selectedResource}`);
                        },
                        selectedResourceID: this._selectedResource
                        // TODO: Change functions like "report xxx" to better names
                    },
                    React.createElement(
                        NamedImageButtonComponent,
                        {
                            id: "-1",
                            image: "",
                            name: "Upload...",
                            onClick: () => {
                                this._uploadID = undefined;
                                this.openFileUploadWindow();
                            }
                        },
                        null
                    )
                )
            ),
            React.createElement(UIElementComponent, {key: "tools", class: "tools"},
                React.createElement(
                    ToolButtonsComponent,
                    {
                        tools: [
                            {
                                id: "place",
                                name: "Place",
                                icon: ""
                            },
                            {
                                id: "edit",
                                name: "Edit",
                                icon: ""
                            },
                            {
                                id: "erase",
                                name: "Erase",
                                icon: ""
                            }
                        ],
                        selectedTool: this._selectedTool,
                        onChange: this.setTool,
                    },
                null)
            )
        ];

        if (this._inspectedEntity !== undefined) {
            elems.push(
                React.createElement(UIElementComponent,
                    {
                        key: "entity-inspection",
                        class: "entity-inspection",
                        style: {
                            top: "50vmin",
                            left: "50vmin",
                            width: "30vmin",
                            height: "30vmin",
                            position: "absolute"
                        }
                    },
                    React.createElement(TitledWindowComponent,
                        {
                            title: "Entity Inspection",
                            closeable: true,
                            onClose: () => this.inspect(undefined)
                        },
                        React.createElement(
                            ComponentListComponent,
                            {
                                components: this._entityData,
                                onOptionUpdate: this.reportComponentOptionChange,
                                onDelete: (component: ComponentInfo) => {
                                    this.reportComponentDeletion(component.id);
                                }
                            },
                            React.createElement(
                                NamedImageButtonComponent,
                                {
                                    id: "-1",
                                    image: "",
                                    name: "Apply...",
                                    onClick: () => {
                                        this.applyScript();
                                    }
                                },
                                null
                            )
                        )
                    )
                )
            );
        }

        if (this._uploadWindowVisible) {
            elems.push(
                React.createElement(UIElementComponent,
                    {
                        key: "upload",
                        class: "upload",
                        style: {
                            top: "48vmin",
                            left: "48vmin",
                            width: "30vmin",
                            height: "30vmin",
                            position: "absolute"
                        }
                    },
                    React.createElement(TitledWindowComponent,
                        {
                            title: "Upload Resource",
                            closeable: true,
                            onClose: this.closeFileUploadWindow
                        },
                        React.createElement(
                            FileUploaderComponent,
                            {
                                onFilesUpload: (resource) => {
                                    this.reportFilesUpload(resource, this._uploadID);
                                }
                            },
                            null
                        )
                    )
                )
            );
        }

        ReactDOM.render(
            React.createElement("div",
                {className: "uiElements"},
                elems,
                null
            ),
            document.getElementById("ui")
        );
    }
    public addChatMessage(message: string) {
        this._messages.push(message);
    }
    public sendEnteredChatMessage = (message: string) => {
        if (this.onPlayerMessageEntry !== undefined && this._chatEntryVal.length > 0) {
            this.onPlayerMessageEntry(message);
            this._chatEntryVal = "";
        }
    }
    public reportComponentOptionChange =
            (component: ComponentInfo, option: ComponentOption, newValue: string) => {
        // TODO: Replace all the ugly logs using concatenation with template literals
        log(DebugLogType.UI, `\'${component.name}:${option.name}\' changed from ${option.currentValue} to ${newValue}`);
        option.currentValue = newValue;
    }

    public setResourceList(resources: Resource[]) {
        const modifiedResources = Array.from(resources);
        for (const resource of modifiedResources) {
            for (const key of Object.keys(resource)) {
                const val = this.getModified(resource.id, key);
                if (val !== undefined) {
                    (resource as any)[key] = val;
                }
            }
        }
        this._resources = modifiedResources;
    }

    public inspect(entityID?: string) {
        this._inspectedEntity = entityID;
    }

    public setEntityData(components: ComponentInfo[], entityID: string) {
        if (entityID === this._inspectedEntity) {
            this._entityData = components;
        }
    }

    public openFileUploadWindow = () => {
        this._uploadWindowVisible = true;
    }
    public closeFileUploadWindow = () => {
        this._uploadWindowVisible = false;
    }

    public beginFileUpload() {
    }

    public endFileUpload() {
        this.closeFileUploadWindow();
    }

    private setTool = (toolID: string) => {
        log(DebugLogType.UI, `Tool ID changed from ${this._selectedTool} to ${toolID}`);
        this._selectedTool = toolID;
        let type = ToolType.Erase;
        switch (toolID) {
            case "place": {
                type = ToolType.Place;
                break;
            }
            case "edit": {
                type = ToolType.Edit;
                break;
            }
        }
        if (this.onToolChange !== undefined) {
            this.onToolChange(type);
        }
    }

    private reportFilesUpload = (files: FileList, resourceID?: string) => {
        this.onResourceUpload!(files, resourceID);
    }

    private reportResourceDeletion = (resourceID: string) => {
        this.onResourceDelete!(resourceID);
    }
    private reportComponentDeletion = (componentID: string) => {
        this.onComponentDelete!(componentID);
    }

    private reportScriptRun = (resourceID: string, args: string, entityID?: string) => {
        this.onScriptRun!(resourceID, args, entityID);
    }

    private resourcePropertyChanged = (resource: Resource, kind: string, value: string) => {
        (resource as any)[kind] = value;
        this.setModified(resource.id, kind, value);
    }

    private resourcePropertySubmit = (resource: Resource, kind: string, value: string) => {
        (resource as any)[kind] = value;
        this.onResourceInfoModify!(resource.id, kind, value);
        this.unsetModified(resource.id, kind);
    }

    private getModified(resourceID: string, property: string) {
        if (this._modifiedAttributes[resourceID] === undefined) {
            return undefined;
        }
        return this._modifiedAttributes[resourceID][property];
    }

    private setModified(resourceID: string, property: string, value: string) {
        if (this._modifiedAttributes[resourceID] === undefined) {
            this._modifiedAttributes[resourceID] = {};
        }
        this._modifiedAttributes[resourceID][property] = value;
    }

    private unsetModified(resourceID: string, property: string) {
        if (this._modifiedAttributes[resourceID] === undefined) {
            this._modifiedAttributes[resourceID] = {};
        }
        this._modifiedAttributes[resourceID][property] = undefined;
    }

    private applyScript() {
        const resource = this._resources.find((res) => res.id === this._selectedResource);
        if (this._selectedResource !== undefined && resource !== undefined && resource.type === ResourceType.Script) {
            this.reportScriptRun(this._selectedResource, "", this._inspectedEntity);
        }
    }
}
