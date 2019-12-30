import * as React from "react";

interface BooleanDisplayProperties {
    displayValue: string;
    type: string;
    readOnly: boolean;
    onChange: (newValue: string) => void;
}

/**
 * A react component for displaying an individual boolean property of a game entity component.
 *
 * @export
 * @class BooleanDisplayComponent
 * @extends {React.Component<BooleanDisplayProperties>}
 */
export default class BooleanDisplayComponent extends React.Component<BooleanDisplayProperties> {
    public render() {
        return <input
            type="checkbox"
            checked={this.props.displayValue === "true"}
            readOnly={this.props.readOnly}
            onChange={(event: React.ChangeEvent<HTMLElement>) => {
                this._onChange((event.target as any).checked ? "true" : "false");
            }}
        />;
    }
    private _onChange(newValue: string) {
        this.props.onChange(newValue);
    }
}
