import React from "react";
import ComponentOption, { ComponentOptionType } from "resource-management/component-option";
import BooleanDisplayComponent from "./property-display/boolean-display-component";
import DefaultPropertyDisplayComponent from "./property-display/default-property-display-component";
import NumberDisplayComponent from "./property-display/number-display-component";
import StringDisplayComponent from "./property-display/string-display-component";

interface IComponentDisplayProperties {
    name: string;
    description: string;
    options: ComponentOption[];
    onOptionUpdate: (option: ComponentOption, newValue: string) => void;
    onDelete: () => void;
}

export default class ComponentDisplayComponent extends React.Component<IComponentDisplayProperties> {
    public render() {
        return <div className="component-display-component">
            <div className="component-name">{this.props.name}</div>
            <div className="component-description">{this.props.description}</div>
            <div className="table component-options-table">{
                this.props.options.map((option: ComponentOption) => {
                    return <div key={option.id} className="table-row">
                        <div className="table-data">{option.name}</div>
                        <div className="table-data">{(() => {
                            switch (option.type) {
                                case ComponentOptionType.Number: {
                                    return <NumberDisplayComponent
                                        type={option.type}
                                        displayValue={option.baseValue}
                                        readOnly={option.readOnly}
                                        onChange={(newValue: string) => {
                                            this.onChange(option, newValue);
                                        }}
                                    />;
                                }
                                case ComponentOptionType.String: {
                                    return <StringDisplayComponent
                                        type={option.type}
                                        displayValue={option.baseValue}
                                        readOnly={option.readOnly}
                                        onChange={(newValue: string) => {
                                            this.onChange(option, newValue);
                                        }}
                                    />;
                                }
                                case ComponentOptionType.Boolean: {
                                    return <BooleanDisplayComponent
                                        type={option.type}
                                        displayValue={option.baseValue}
                                        readOnly={option.readOnly}
                                        onChange={(newValue: string) => {
                                            this.onChange(option, newValue);
                                        }}
                                    />;
                                }
                                default: {
                                    return <DefaultPropertyDisplayComponent
                                        type={option.type}
                                        displayValue={option.baseValue}
                                        readOnly={option.readOnly}
                                        onChange={(newValue: string) => {
                                            this.onChange(option, newValue);
                                        }}
                                    />;
                                }
                            }
                        })()}</div>
                    </div>;
                })
            }</div>
            <div className="resource-options">
                <button className="delete-button" onClick={this.handleDelete}>Delete</button>
            </div>
        </div>;
    }
    private onChange(option: ComponentOption, newValue: string) {
        this.props.onOptionUpdate(option, newValue);
    }
    private handleDelete = () => {
        this.props.onDelete();
    }
}
