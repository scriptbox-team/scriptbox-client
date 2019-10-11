import * as React from "react";

interface IDefaultPropertyDisplayProperties {
    displayValue: string;
    type: string;
    readOnly: boolean;
    onChange: (newValue: string) => void;
}

export default class DefaultPropertyDisplayComponent extends React.Component<IDefaultPropertyDisplayProperties> {
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
