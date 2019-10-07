import * as React from "react";

interface IUIElementProperties {
    class: string;
    style?: React.CSSProperties;
}
export default class UIElementComponent extends React.Component<IUIElementProperties>{
    public render() {
        const className = `ui-element ${this.props.class}`;
        return <div className={className} style={this.props.style}>{this.props.children}</div>;
    }
}
