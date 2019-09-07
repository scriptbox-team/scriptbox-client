import * as React from "react";

interface IUIElementProperties {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

// TODO: Add anchors for UI Elements

export default class UIElementComponent extends React.Component<IUIElementProperties>{
    public render() {
        const className = "ui-component";
        const xpos = this.props.x;
        const ypos = this.props.y;
        const style = {
            left: xpos + "vmin",
            top: ypos + "vmin",
            width: this.props.width + "vmin",
            height: this.props.height + "vmin",
            position: "absolute" as "absolute"
        };
        return <div className={className} id={this.props.id} style={style}>{this.props.children}</div>;
    }
}
