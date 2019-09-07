import React from "react";
import NamedImageButtonComponent from "./named-image-button-component";

interface IGridListProperties<T> {
    class: string;
    direction: "horizontal" | "vertical";
    resources: T[];
    onClick: (id: string) => void;
}

interface IResource {
    id: string;
    icon: string;
    name: string;
}

export default class GridListComponent<T extends IResource> extends React.Component<IGridListProperties<T>> {
    public render() {
        return <div
            className={`grid-list grid-list-${this.props.direction} ${this.props.class}`}
        >{this.props.resources.map((resource) => {
            return <NamedImageButtonComponent
                {...resource}
                id={resource.id}
                image={resource.icon}
                name={resource.name}
                onClick={this.props.onClick}
                key={"" + resource.id}
            />;
        })}
        {this.props.children}
        </div>;
    }
}
