import * as React from "react";

interface DefaultPropertyDisplayProperties {
    displayValue: string;
    type: string;
    readOnly: boolean;
    onChange: (newValue: string) => void;
}

/**
 * A component for displaying a generic property of a game entity component.
 *
 * @export
 * @class DefaultPropertyDisplayComponent
 * @extends {React.Component<DefaultPropertyDisplayProperties>}
 */
export default class DefaultPropertyDisplayComponent extends React.Component<DefaultPropertyDisplayProperties> {
    public render() {
        return <textarea
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
