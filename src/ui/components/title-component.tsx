import React from "react";

interface TitleProperties {
    title: string;
}

/**
 * A component that displays a title.
 *
 * @export
 * @class TitleComponent
 * @extends {React.Component<TitleProperties>}
 */
export default class TitleComponent extends React.Component<TitleProperties> {
    public render() {
        return <div className="scriptbox-title">{this.props.title}</div>;
    }
}
