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
    selectedComponentID?: number;
}

export default class ComponentListComponent extends React.Component<IComponentListProperties, IComponentListState> {
    constructor(props: IComponentListProperties) {
        super(props);
        this.state = {selectedComponentID: undefined};
        this.setComponent = this.setComponent.bind(this);
        this.reportOptionUpdate = this.reportOptionUpdate.bind(this);
    }
    public render() {
        return <div className="resource-list">
            <GridListComponent<ComponentInfo, number>
                class="resource-select"
                direction="vertical"
                resources={this.props.components}
                onClick={this.setComponent}
            >
            {this.props.children}
            </GridListComponent>
            {(() => {
                if (this.state.selectedComponentID !== undefined) {
                    const component = this.getComponent(this.state.selectedComponentID);
                    if (component !== undefined) {
                        return <ComponentDisplayComponent
                            name={component.name}
                            description={component.description}
                            options={component.options}
                            onOptionUpdate={this.reportOptionUpdate}
                            onDelete={() => this.onDelete(component)}
                        />;
                    }
                }
                return <div className="resource-display">Choose a component to inspect.</div>;
            })()}
        </div>;
    }
    private setComponent(id?: number) {
        this.setState({selectedComponentID: id});
    }
    private getComponent(id: number) {
        return this.props.components.find((res) => res.id === id);
    }
    private reportOptionUpdate(option: ComponentOption, newVal: string) {
        this.props.onOptionUpdate(this.getComponent(this.state.selectedComponentID!)!, option, newVal);
    }
    private onDelete = (resource: ComponentInfo) => {
        this.props.onDelete(resource);
    }
}
