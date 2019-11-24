import React from "react";
import ComponentInfo from "resource-management/component-info";
import ComponentOption from "resource-management/component-option";

import GridListComponent from "./grid-list-component";
import NamedImageButtonComponent from "./named-image-button-component";
import ComponentDisplayComponent from "./resource-display/component-display-component";

interface ComponentListProperties {
    entityControlledByPlayer: boolean;
    components: ComponentInfo[];
    onOptionUpdate: (resource: ComponentInfo, option: ComponentOption, newVal: string) => void;
    onDelete: (resource: ComponentInfo) => void;
    onEntityControlChange: (control: boolean) => void;
    onComponentEnableStateChanged: (componentID: string, state: boolean) => void;
    onMetaChange: (componentID: string, option: string, newValue: string) => void;
    onMetaSubmit: (componentID: string, option: string, newValue: string) => void;
    // onInfoChange: (resource: ComponentInfo, kind: string, value: string) => void;
    // onInfoSubmit: (resource: ComponentInfo, kind: string, value: string) => void;
}

interface ComponentListState {
    selectedComponentID?: string;
}

export default class ComponentListComponent extends React.Component<ComponentListProperties, ComponentListState> {
    constructor(props: ComponentListProperties) {
        super(props);
        this.state = {selectedComponentID: undefined};
        this._setComponent = this._setComponent.bind(this);
        this._reportOptionUpdate = this._reportOptionUpdate.bind(this);
        this._onEntityControlChange = this._onEntityControlChange.bind(this);
        this._onToggleEnableState = this._onToggleEnableState.bind(this);
        this._onDelete = this._onDelete.bind(this);
    }
    public render() {
        return <div className="component-list">
            <GridListComponent<ComponentInfo, string>
                class="component-select"
                direction="vertical"
                resources={this.props.components}
                onClick={this._setComponent}
            >
            {this.props.children}
            </GridListComponent>
            <NamedImageButtonComponent
                id="control"
                name={this.props.entityControlledByPlayer ? "Release" : "Control"}
                image=""
                onClick={() => this._onEntityControlChange(!this.props.entityControlledByPlayer)}
            />
            {(() => {
                if (this.state.selectedComponentID !== undefined) {
                    const component = this._getComponent(this.state.selectedComponentID);
                    if (component !== undefined) {
                        return <ComponentDisplayComponent
                            id={component.id}
                            name={component.name}
                            enabled={component.enabled}
                            options={component.options}
                            onOptionUpdate={this._reportOptionUpdate}
                            onDelete={() => this._onDelete(component)}
                            onToggleEnableState={this._onToggleEnableState}
                            onMetaChange={(id, option, newVal) => this._onMetaChange(id, option, newVal)}
                            onMetaSubmit={(id, option, newVal) => this._onMetaSubmit(id, option, newVal)}
                        />;
                    }
                }
                return <div className="component-display">Choose a component to inspect.</div>;
            })()}
        </div>;
    }
    private _setComponent(id?: string) {
        this.setState({selectedComponentID: id});
    }
    private _getComponent(id: string) {
        return this.props.components.find((res) => res.id === id);
    }
    private _reportOptionUpdate(option: ComponentOption, newVal: string) {
        this.props.onOptionUpdate(this._getComponent(this.state.selectedComponentID!)!, option, newVal);
    }
    private _onDelete(resource: ComponentInfo) {
        this.props.onDelete(resource);
    }
    private _onEntityControlChange(control: boolean) {
        this.props.onEntityControlChange(control);
    }
    private _onToggleEnableState(toggleTo: boolean) {
        if (this.state.selectedComponentID !== undefined) {
            this.props.onComponentEnableStateChanged(this.state.selectedComponentID, toggleTo);
        }
    }
    private _onMetaChange(id: string, option: string, newValue: string) {
        this.props.onMetaChange(id, option, newValue);
    }
    private _onMetaSubmit(id: string, option: string, newValue: string) {
        this.props.onMetaSubmit(id, option, newValue);
    }
}
