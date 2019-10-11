import React from "react";
import ComponentInfo from "resource-management/component-info";
import ComponentOption from "resource-management/component-option";

import GridListComponent from "./grid-list-component";
import ComponentDisplayComponent from "./resource-display/component-display-component";

interface IComponentListProperties {
    components: ComponentInfo[];
    onOptionUpdate: (resource: ComponentInfo, option: ComponentOption, newVal: string) => void;
    onDelete: (resource: ComponentInfo) => void;
    // onInfoChange: (resource: ComponentInfo, kind: string, value: string) => void;
    // onInfoSubmit: (resource: ComponentInfo, kind: string, value: string) => void;
}

interface IComponentListState {
    selectedComponentID?: string;
}

export default class ComponentListComponent extends React.Component<IComponentListProperties, IComponentListState> {
    constructor(props: IComponentListProperties) {
        super(props);
        this.state = {selectedComponentID: undefined};
        this._setComponent = this._setComponent.bind(this);
        this._reportOptionUpdate = this._reportOptionUpdate.bind(this);
    }
    public render() {
        return <div className="resource-list">
            <GridListComponent<ComponentInfo, string>
                class="resource-select"
                direction="vertical"
                resources={this.props.components}
                onClick={this._setComponent}
            >
            {this.props.children}
            </GridListComponent>
            {(() => {
                if (this.state.selectedComponentID !== undefined) {
                    const component = this._getComponent(this.state.selectedComponentID);
                    if (component !== undefined) {
                        return <ComponentDisplayComponent
                            name={component.name}
                            description={component.description}
                            options={component.options}
                            onOptionUpdate={this._reportOptionUpdate}
                            onDelete={() => this._onDelete(component)}
                        />;
                    }
                }
                return <div className="resource-display">Choose a component to inspect.</div>;
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
    private _onDelete = (resource: ComponentInfo) => {
        this.props.onDelete(resource);
    }
}
