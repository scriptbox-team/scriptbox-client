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
import ResourceRepositoryComponent from "./components/resource-repository-component";
import ScriptEditComponent from "./components/script-edit-component";
import TitledWindowComponent from "./components/titled-window.component";
import ToolButtonsComponent from "./components/tool-buttons-component";
import UIElementComponent from "./components/ui-element-component";
import GameUI from "./game-ui";

// TODO: Replace arrow function properties [public blah = () => {}] with binds
// It turns out that this makes mocking more difficult, among other things

export default class GameUIPure extends GameUI {
    private _messages: string[] = [];
    private _chatEntryVal: string = "";
    private _selectedTool: string = "edit";
    private _selectedResource?: string;
    private _resources: Resource[];
    private _repoResources: Resource[];
    private _entityData: ComponentInfo[];
    private _inspectedEntity?: string;
    private _controllingInspectedEntity: boolean;
    private _modifiedAttributes: {[resourceID: string]: {[property: string]: string | undefined}};
    private _modifiedComponentMeta: {[resourceID: string]: {[property: string]: string | undefined}};
    private _uploadWindowVisible: boolean = false;
    private _uploadID?: string;
    private _editingScript?: string;
    private _editingScriptText?: string;
    private _repoWindowVisible: boolean;
    private _repoSearchTerm: string | undefined;
    private _setChatMessageValue?: (value: string) => void;
    constructor() {
        super();
        this._resources = [];
        this._repoResources = [];
        this._entityData = [];
        this._modifiedAttributes = {};
        this._modifiedComponentMeta = {};
        this._controllingInspectedEntity = false;
        this._repoWindowVisible = false;
        this._reportComponentEnableStateChange = this._reportComponentEnableStateChange.bind(this);
        this._reportControlChange = this._reportControlChange.bind(this);
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
                        onMessageEntrySubmit: this.sendEnteredChatMessage,
                        setMessageEntryValue: (func: (value: string) => void) => {
                            this._setChatMessageValue = func;
                        }
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
                            this._reportResourceDeletion(resource.id);
                        },
                        onSoundPlay: (resource: Resource) => {},
                        onSoundStop: (resource: Resource) => {},
                        onScriptRun: (resource: Resource, args: string) => {
                            this._reportScriptRun(resource.id, args);
                        },
                        onScriptEdit: (resource: Resource) => {
                            this._beginEditingScript(resource.id);
                        },
                        onInfoChange: (resource: Resource, kind: string, newValue: string) => {
                            console.log("info change.");
                            this._resourcePropertyChanged(resource, kind, newValue);
                        },
                        onInfoSubmit: (resource: Resource, kind: string, newValue: string) => {
                            this._resourcePropertySubmit(resource, kind, newValue);
                        },
                        onResourceChange: (resourceID?: string) => {
                            this._selectedResource = resourceID;
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
                    ),
                    React.createElement(
                        NamedImageButtonComponent,
                        {
                            id: "-2",
                            image: "",
                            name: "Find Resources!",
                            onClick: () => {
                                this._repoWindowVisible = true;
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
                        onChange: this._setTool,
                    },
                null)
            )
        ];

        if (this._repoWindowVisible) {
            elems.push(
                React.createElement(UIElementComponent,
                    {
                        key: "shared-repository",
                        class: "shared-repository",
                        style: {
                            top: "30vmin",
                            left: "30vmin",
                            width: "60vmin",
                            height: "60vmin",
                            position: "absolute"
                        }
                    },
                    React.createElement(TitledWindowComponent,
                        {
                            title: `Shared Scripts`,
                            closeable: true,
                            onClose: () => {this._repoWindowVisible = false; }
                        },
                        React.createElement(
                            ResourceRepositoryComponent,
                            {
                                resources: this._repoResources,
                                onSearch: (search) => {
                                    this._repoSearchTerm = search;
                                    this._submitSearch(search);
                                },
                                onClone: (resource) => {
                                    this._cloneResource(resource);
                                }
                            }
                        )
                    )
                )
            );
        }

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
                            title: `Entity Inspection (ID: ${this._inspectedEntity})`,
                            closeable: true,
                            onClose: () => this.inspect(undefined)
                        },
                        React.createElement(
                            ComponentListComponent,
                            {
                                entityControlledByPlayer: this._controllingInspectedEntity,
                                components: this._entityData,
                                onOptionUpdate: this.reportComponentOptionChange,
                                onDelete: (component: ComponentInfo) => {
                                    this._reportComponentDeletion(component.id);
                                },
                                onEntityControlChange: (control: boolean) => this._reportControlChange(control),
                                onComponentEnableStateChanged: (componentID: string, state: boolean) => {
                                    this._reportComponentEnableStateChange(componentID, state);
                                },
                                onMetaChange: (resourceID: string, option: string, value: string) => {
                                    this._setModifiedComponentMeta(resourceID, option, value);
                                },
                                onMetaSubmit: (resourceID: string, option: string, value: string) => {
                                    if (this.onModifyComponentMeta !== undefined) {
                                        this.onModifyComponentMeta(resourceID, option, value);
                                    }
                                    (this._entityData.find((info) => info.id === resourceID)! as any)[option] = value;
                                    console.log((this._entityData.find((info) => info.id === resourceID)!));
                                    this._unsetModifiedComponentMeta(resourceID, option);
                                }
                            },
                            React.createElement(
                                NamedImageButtonComponent,
                                {
                                    id: "-1",
                                    image: "",
                                    name: "Apply...",
                                    onClick: () => {
                                        this._applyScript();
                                    }
                                },
                                null
                            )
                        )
                    )
                )
            );
        }

        if (this._editingScript !== undefined && this._editingScriptText !== undefined) {
            elems.push(
                React.createElement(UIElementComponent,
                    {
                        key: "script-edit",
                        class: "script-edit",
                        style: {
                            top: "30vmin",
                            left: "30vmin",
                            width: "60vmin",
                            height: "60vmin",
                            position: "absolute"
                        }
                    },
                    React.createElement(TitledWindowComponent,
                        {
                            title: `Editing Script`,
                            closeable: true,
                            onClose: () => this._cancelScriptEdit()
                        },
                        React.createElement(
                            ScriptEditComponent,
                            {
                                script: this._editingScriptText,
                                onSave: (script: string, build: boolean) => {
                                    this._saveScript(this._editingScript!, script, build);
                                    this._editingScript = undefined;
                                },
                                onCancel: () => this._cancelScriptEdit(),
                                onChange: (val: string) => {
                                    this._editingScriptText = val;
                                }
                            },
                            null
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
                                    this._reportFilesUpload(resource, this._uploadID);
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
            if (this._setChatMessageValue !== undefined) {
                this._setChatMessageValue("");
            }
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
                const val = this._getModified(resource.id, key);
                if (val !== undefined) {
                    (resource as any)[key] = val;
                }
            }
        }
        this._resources = modifiedResources;
    }

    public inspect(entityID: string | undefined) {
        this._inspectedEntity = entityID;
        this._controllingInspectedEntity = false;
    }

    public setEntityData(components: ComponentInfo[], entityID: string, controlled: boolean) {
        if (entityID === this._inspectedEntity) {
            const modifiedComponents = Array.from(components);
            for (const resource of modifiedComponents) {
                for (const key of Object.keys(resource)) {
                    const val = this._getModifiedComponentMeta(resource.id, key);
                    if (val !== undefined) {
                        (resource as any)[key] = val;
                    }
                }
            }
            this._entityData = modifiedComponents;
        }
        this._controllingInspectedEntity = controlled;
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

    public setResourceRepoList(resources: Resource[], search: string): void {
        if (search !== this._repoSearchTerm) {
            return;
        }
        const modifiedResources = Array.from(resources);
        this._repoResources = modifiedResources;
    }

    public setEditingScriptText(scriptID: string, script: string): void {
        if (this._editingScript === scriptID) {
            this._editingScriptText = script;
        }
    }

    private _setTool = (toolID: string) => {
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

    private _reportFilesUpload = (files: FileList, resourceID?: string) => {
        this.onResourceUpload!(files, resourceID);
    }

    private _reportResourceDeletion = (resourceID: string) => {
        this.onResourceDelete!(resourceID);
    }
    private _reportComponentDeletion = (componentID: string) => {
        this.onComponentDelete!(componentID);
    }

    private _reportControlChange(controlState: boolean) {
        if (controlState) {
            this.onEntityControl!(this._inspectedEntity);
        }
        else {
            this.onEntityControl!(undefined);
        }
    }

    private _reportComponentEnableStateChange(componentID: string, state: boolean) {
        this.onComponentEnableState!(componentID, state);
    }

    private _reportScriptRun = (resourceID: string, args: string, entityID?: string) => {
        this.onScriptRun!(resourceID, args, entityID);
    }

    private _resourcePropertyChanged = (resource: Resource, kind: string, value: string) => {
        (resource as any)[kind] = value;
        this._setModified(resource.id, kind, value);
    }

    private _resourcePropertySubmit = (resource: Resource, kind: string, value: string) => {
        (resource as any)[kind] = value;
        this.onResourceInfoModify!(resource.id, kind, value);
        this._unsetModified(resource.id, kind);
    }

    private _getModified(resourceID: string, property: string) {
        if (this._modifiedAttributes[resourceID] === undefined) {
            return undefined;
        }
        return this._modifiedAttributes[resourceID][property];
    }

    private _setModified(resourceID: string, property: string, value: string) {
        if (this._modifiedAttributes[resourceID] === undefined) {
            this._modifiedAttributes[resourceID] = {};
        }
        this._modifiedAttributes[resourceID][property] = value;
    }

    private _unsetModified(componentID: string, property: string) {
        if (this._modifiedAttributes[componentID] === undefined) {
            this._modifiedAttributes[componentID] = {};
        }
        this._modifiedAttributes[componentID][property] = undefined;
    }

    private _getModifiedComponentMeta(componentID: string, property: string) {
        if (this._modifiedComponentMeta[componentID] === undefined) {
            return undefined;
        }
        return this._modifiedComponentMeta[componentID][property];
    }

    private _setModifiedComponentMeta(componentID: string, property: string, value: string) {
        if (this._modifiedComponentMeta[componentID] === undefined) {
            this._modifiedComponentMeta[componentID] = {};
        }
        this._modifiedComponentMeta[componentID][property] = value;
    }

    private _unsetModifiedComponentMeta(componentID: string, property: string) {
        if (this._modifiedComponentMeta[componentID] === undefined) {
            this._modifiedComponentMeta[componentID] = {};
        }
        this._modifiedComponentMeta[componentID][property] = undefined;
    }

    private _applyScript() {
        const resource = this._resources.find((res) => res.id === this._selectedResource);
        if (this._selectedResource !== undefined && resource !== undefined && resource.type === ResourceType.Script) {
            this._reportScriptRun(this._selectedResource, "", this._inspectedEntity);
        }
    }

    private _saveScript(scriptID: string, script: string, build: boolean) {
        if (this.onEditScript !== undefined) {
            this.onEditScript(scriptID, script);
        }
    }

    private _cancelScriptEdit() {
        this._editingScript = undefined;
        this._editingScriptText = undefined;
    }

    private _beginEditingScript(id: string) {
        this._editingScript = id;
        if (this.onRequestEditScript !== undefined) {
            this.onRequestEditScript(id);
        }
    }

    private _submitSearch(search: string) {
        if (this.onSearchResourceRepo !== undefined) {
            this.onSearchResourceRepo(search);
        }
    }

    private _cloneResource(resource: Resource) {
        if (this.onCloneResource !== undefined) {
            this.onCloneResource(resource.id);
        }
    }
}
