import * as React from "react";

interface UIElementProperties {
    class: string;
    style?: React.CSSProperties;
}
/**
 * A component used for a single major UI element.
 *
 * @export
 * @class UIElementComponent
 * @extends {React.Component<UIElementProperties>}
 */
export default class UIElementComponent extends React.Component<UIElementProperties>{
    public render() {
        const className = `ui-element ${this.props.class}`;
        return <div className={className} style={this.props.style}>{this.props.children}</div>;
    }
}
