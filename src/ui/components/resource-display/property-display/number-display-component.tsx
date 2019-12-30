import * as React from "react";

interface NumberDisplayProperties {
    displayValue: string;
    type: string;
    readOnly: boolean;
    onChange: (newValue: string) => void;
}

/**
 * A component for displaying a number property of a game entity component.
 *
 * @export
 * @class NumberDisplayComponent
 * @extends {React.Component<NumberDisplayProperties>}
 */
export default class NumberDisplayComponent extends React.Component<NumberDisplayProperties> {
    public render() {
        return <input
            type="number"
            value={this.props.displayValue}
            placeholder={this.props.type}
            readOnly={this.props.readOnly}
            onChange={(event: React.ChangeEvent<HTMLElement>) => {
                this._onChange((event.target as any).value + "");
            }}
        />;
    }
    private _onChange(newValue: string) {
        this.props.onChange(newValue);
    }
}
