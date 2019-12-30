import React from "react";
import ComponentOption, { ComponentOptionType } from "resource-management/component-option";

import TextEntryComponent from "../text-entry-component";
import BooleanDisplayComponent from "./property-display/boolean-display-component";
import DefaultPropertyDisplayComponent from "./property-display/default-property-display-component";
import NumberDisplayComponent from "./property-display/number-display-component";
import StringDisplayComponent from "./property-display/string-display-component";

interface ComponentDisplayProperties {
    id: string;
    name: string;
    enabled: boolean;
    options: ComponentOption[];
    onOptionUpdate: (option: ComponentOption, newValue: string) => void;
    onMetaChange: (componentID: string, option: string, newValue: string) => void;
    onMetaSubmit: (componentID: string, option: string, newValue: string) => void;
    onDelete: () => void;
    onToggleEnableState: (state: boolean) => void;
}

/**
 * A component for displaying all the information of a game entity component.
 *
 * @export
 * @class ComponentDisplayComponent
 * @extends {React.Component<ComponentDisplayProperties>}
 */
export default class ComponentDisplayComponent extends React.Component<ComponentDisplayProperties> {
    public render() {
        return <div className="component-display">
            <input
                type="checkbox"
                checked={this.props.enabled}
                onChange={(event: React.ChangeEvent<HTMLElement>) => {
                    this._onToggleEnableState((event.target as any).checked);
                }}
            />;
            <TextEntryComponent
                class="component-name"
                value={this.props.name}
                onChange={(newVal) => this._onMetaChange("name", newVal)}
                onSubmit={(newVal) => this._onMetaSubmit("name", newVal)}
                submitOnEnter
                submitOnUnfocus
                pretty
            />
            <div className="component-id">(ID: {this.props.id})</div>
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
                                            this._onChange(option, newValue);
                                        }}
                                    />;
                                }
                                case ComponentOptionType.String: {
                                    return <StringDisplayComponent
                                        type={option.type}
                                        displayValue={option.baseValue}
                                        readOnly={option.readOnly}
                                        onChange={(newValue: string) => {
                                            this._onChange(option, newValue);
                                        }}
                                    />;
                                }
                                case ComponentOptionType.Boolean: {
                                    return <BooleanDisplayComponent
                                        type={option.type}
                                        displayValue={option.baseValue}
                                        readOnly={option.readOnly}
                                        onChange={(newValue: string) => {
                                            this._onChange(option, newValue);
                                        }}
                                    />;
                                }
                                default: {
                                    return <DefaultPropertyDisplayComponent
                                        type={option.type}
                                        displayValue={option.baseValue}
                                        readOnly={option.readOnly}
                                        onChange={(newValue: string) => {
                                            this._onChange(option, newValue);
                                        }}
                                    />;
                                }
                            }
                        })()}</div>
                    </div>;
                })
            }</div>
            <div className="resource-options">
                <button className="delete-button" onClick={this._handleDelete}>Delete</button>
            </div>
        </div>;
    }
    private _onMetaChange(option: string, newValue: string) {
        this.props.onMetaChange(this.props.id, option, newValue);
    }
    private _onMetaSubmit(option: string, newValue: string) {
        this.props.onMetaSubmit(this.props.id, option, newValue);
    }
    private _onChange(option: ComponentOption, newValue: string) {
        this.props.onOptionUpdate(option, newValue);
    }
    private _onToggleEnableState(state: boolean) {
        this.props.onToggleEnableState(state);
    }
    private _handleDelete = () => {
        this.props.onDelete();
    }
}
