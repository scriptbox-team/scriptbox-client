import React from "react";
import Resource from "resource-management/resource";
import ResourceOption, { ResourceOptionType } from "resource-management/resource-option";

interface IComponentDisplayProperties {
    resource: Resource;
    onOptionUpdate: (option: ResourceOption, newValue: string) => void;
}

export default class ComponentDisplayComponent extends React.Component<IComponentDisplayProperties> {
    public render() {
        return <div className="component-display-component">
            <div className="component-name">{this.props.resource.name}</div>
            <div className="component-description">{this.props.resource.description}</div>
            <div className="table component-options-table">{
                this.props.resource.options.map((option: ResourceOption) => {
                    return <div key={option.id} className="table-row">
                        <div className="table-data">{option.name}</div>
                        <div className="table-data">{(() => {
                            switch (option.type) {
                                case ResourceOptionType.Number: {
                                    return <input
                                        type="number"
                                        value={option.displayValue}
                                        placeholder={option.type}
                                        readOnly={option.readOnly}
                                        onChange={(event: React.ChangeEvent<HTMLElement>) => {
                                            this.onChange(option, (event.target as any).value + "");
                                        }}
                                    />;
                                }
                                case ResourceOptionType.String: {
                                    return <input
                                        type="text"
                                        value={option.displayValue}
                                        placeholder={option.type}
                                        readOnly={option.readOnly}
                                        onChange={(event: React.ChangeEvent<HTMLElement>) => {
                                            this.onChange(option, (event.target as any).value);
                                    }} />;
                                }
                                case ResourceOptionType.Boolean: {
                                    return <input
                                        type="checkbox"
                                        checked={option.displayValue === "true"}
                                        readOnly={option.readOnly}
                                        onChange={(event: React.ChangeEvent<HTMLElement>) => {
                                            this.onChange(option, (event.target as any).checked ? "true" : "false");
                                    }} />;
                                }
                                default: {
                                    return <input
                                        type="text"
                                        placeholder={option.type}
                                        value={option.displayValue}
                                        readOnly={option.readOnly}
                                        onChange={(event: React.ChangeEvent<HTMLElement>) => {
                                            this.onChange(option, (event.target as any).value);
                                    }} />;
                                }
                            }
                        })()}</div>
                    </div>;
                })
            }</div>
        </div>;
    }
    private onChange(option: ResourceOption, newValue: string) {
        this.props.onOptionUpdate(option, newValue);
    }
}
