import * as React from "react";

interface IBooleanDisplayProperties {
    displayValue: string;
    type: string;
    readOnly: boolean;
    onChange: (newValue: string) => void;
}

export default class BooleanDisplayComponent extends React.Component<IBooleanDisplayProperties> {
    public render() {
        return <input
            type="checkbox"
            checked={this.props.displayValue === "true"}
            readOnly={this.props.readOnly}
            onChange={(event: React.ChangeEvent<HTMLElement>) => {
                this.onChange((event.target as any).checked ? "true" : "false");
            }}
        />;
    }
    private onChange(newValue: string) {
        this.props.onChange(newValue);
    }
}
