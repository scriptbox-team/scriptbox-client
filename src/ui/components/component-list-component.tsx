import React from "react";
import Resource from "resource-management/resource";
import ResourceOption from "resource-management/resource-option";
import GridListComponent from "./grid-list-component";
import ComponentDisplayComponent from "./resource-display/component-display-component";

interface IComponentListProperties {
    components: Resource[];
    onOptionUpdate: (resource: Resource, option: ResourceOption, newVal: string) => void;
    onDelete: (resource: Resource) => void;
    // onInfoChange: (resource: Resource, kind: string, value: string) => void;
    // onInfoSubmit: (resource: Resource, kind: string, value: string) => void;
}

interface IComponentListState {
    selectedComponent?: Resource;
}

export default class ComponentListComponent extends React.Component<IComponentListProperties, IComponentListState> {
    constructor(props: IComponentListProperties) {
        super(props);
        this.state = {selectedComponent: undefined};
        this.setResource = this.setResource.bind(this);
        this.reportOptionUpdate = this.reportOptionUpdate.bind(this);
    }
    public render() {
        return <div className="resource-list">
            <GridListComponent
                class="resource-select"
                direction="vertical"
                resources={this.props.components}
                onClick={this.setResource}
            >
            {this.props.children}
            </GridListComponent>
            {(() => {
                if (this.state.selectedComponent !== undefined) {
                    const component = this.state.selectedComponent;
                    return <ComponentDisplayComponent
                        name={component.name}
                        description={component.description}
                        options={component.options}
                        onOptionUpdate={this.reportOptionUpdate}
                        onDelete={() => this.onDelete(component)}
                    />;
                }
                return <div className="resource-display">Choose a component to inspect.</div>;
            })()}
        </div>;
    }
    private setResource(id: string) {
        this.setState({selectedComponent: this.props.components.find((res) => res.id === id)});
    }
    private reportOptionUpdate(option: ResourceOption, newVal: string) {
        this.props.onOptionUpdate(this.state.selectedComponent!, option, newVal);
    }
    private onDelete = (resource: Resource) => {
        this.props.onDelete(resource);
    }
}
