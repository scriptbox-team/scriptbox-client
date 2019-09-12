import { DebugLogType, log } from "core/debug-logger";
import { ToolType } from "input/tool-type";
import * as React from "react";
import * as ReactDOM from "react-dom";
import Resource from "resource-management/resource";
import ResourceOption from "resource-management/resource-option";
import ChatComponent from "./components/chat-component";
import ComponentListComponent from "./components/component-list-component";
import FileUploaderComponent from "./components/file-uploader-component";
import NamedImageButtonComponent from "./components/named-image-button-component";
import ResourceListComponent from "./components/resource-list-component";
import TitledWindowComponent from "./components/titled-window.component";
import ToolButtonsComponent from "./components/tool-buttons-component";
import UIElementComponent from "./components/ui-element-component";
import UIManager from "./ui-manager";

export default class UIManagerPure extends UIManager {
    private _messages: string[] = [];
    private _chatEntryVal: string = "";
    private _selectedTool: string = "edit";
    private _resources: Resource[];
    private _entityData: Resource[];
    private _inspectedEntity?: number;
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
            React.createElement(UIElementComponent, {key: "chat", id: "chat", x: 2, y: 2, width: 30, height: 35},
                React.createElement(
                    ChatComponent,
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
                    id: "resources",
                    x: 30,
                    y: 70,
                    width: 90,
                    height: 25
                },
                React.createElement(
                    ResourceListComponent,
                    {
                        resources: this._resources,
                        onOptionUpdate: this.reportResourceOptionChange,
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
                        }
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
            React.createElement(UIElementComponent, {key: "tools", id: "tools", x: 90, y: 50, width: 7, height: 30},
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
                        id: "entity-inspection",
                        x: 30,
                        y: 40,
                        width: 60,
                        height: 35
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
                                onOptionUpdate: this.reportResourceOptionChange,
                                onDelete: (resource: Resource) => {
                                    this.reportComponentDeletion(resource.id);
                                }
                            },
                            React.createElement(
                                NamedImageButtonComponent,
                                {
                                    id: "-1",
                                    image: "",
                                    name: "Apply...",
                                    onClick: () => {
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
                        id: "upload",
                        x: 50,
                        y: 50,
                        width: 20,
                        height: 20
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
    public reportResourceOptionChange =
            (resource: Resource, option: ResourceOption, newValue: string) => {
        // TODO: Replace all the ugly logs using concatenation with template literals
        log(DebugLogType.UI, `\'${resource.name}:${option.name}\' changed from ${option.displayValue} to ${newValue}`);
        option.displayValue = newValue;
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

    public inspect(entityID?: number) {
        this._inspectedEntity = entityID;
    }

    public setEntityData(components: Resource[], entityID: number) {
        if (entityID === this._inspectedEntity) {
            console.log(components);
            console.log(this._entityData);
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
    private reportComponentDeletion = (resourceID: string) => {
    }

    private reportScriptRun = (resourceID: string, args: string) => {
        this.onScriptRun!(resourceID, args);
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
}
