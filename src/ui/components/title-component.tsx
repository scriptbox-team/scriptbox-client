import React from "react";

interface TitleProperties {
    title: string;
}

export default class TitleComponent extends React.Component<TitleProperties> {
    public render() {
        return <div className="scriptbox-title">{this.props.title}</div>;
    }
}
