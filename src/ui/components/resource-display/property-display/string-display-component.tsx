import * as React from "react";

interface StringDisplayProperties {
    displayValue: string;
    type: string;
    readOnly: boolean;
    onChange: (newValue: string) => void;
}

/**
 * A componnet for displaying a number property of a game entity component.
 *
 * @export
 * @class StringDisplayComponent
 * @extends {React.Component<StringDisplayProperties>}
 */
export default class StringDisplayComponent extends React.Component<StringDisplayProperties> {
    public render() {
        return <input
            type="text"
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
