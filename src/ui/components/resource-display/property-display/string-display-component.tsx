import * as React from "react";

interface IStringDisplayProperties {
    displayValue: string;
    type: string;
    readOnly: boolean;
    onChange: (newValue: string) => void;
}

export default class StringDisplayComponent extends React.Component<IStringDisplayProperties> {
    public render() {
        return <input
            type="text"
            value={this.props.displayValue}
            placeholder={this.props.type}
            readOnly={this.props.readOnly}
            onChange={(event: React.ChangeEvent<HTMLElement>) => {
                this.onChange((event.target as any).value + "");
            }}
        />;
    }
    private onChange(newValue: string) {
        this.props.onChange(newValue);
    }
}
