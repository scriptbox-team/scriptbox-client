import React from "react";

interface NamedImageButtonProperties<T> {
    id: T;
    image: string;
    name: string;
    class?: string;
    onClick: () => void;
}

/**
 * A component for a clickable button which can have an image displayed
 *
 * @export
 * @class NamedImageButtonComponent
 * @extends {React.Component<NamedImageButtonProperties<T>>}
 * @template T
 */
export default class NamedImageButtonComponent<T> extends React.Component<NamedImageButtonProperties<T>> {
    constructor(props: NamedImageButtonProperties<T>) {
        super(props);
        this._onClick = this._onClick.bind(this);
    }
    public shouldComponentUpdate(nextProps: NamedImageButtonProperties<T>, nextState: Readonly<{}>, nextContext: any) {
        if (nextProps.id === this.props.id
        && (nextProps.image !== this.props.image
        || nextProps.name !== this.props.name
        || nextProps.onClick !== this.props.onClick)) {
            return true;
        }
        return false;
    }
    public render() {
        const cl = !this.props.class ? "" : this.props.class;
        return <button className={"named-image-button " + cl} onClick={this._onClick}>
            <div className={"named-image-button-container " + cl}>
                <div className={"named-image-button-name " + cl}>{this.props.name}</div>
                <img className={"named-image-button-image " + cl} src={this.props.image} />
            </div>
        </button>;
    }
    private _onClick(ev: React.MouseEvent<HTMLButtonElement>) {
        ev.stopPropagation();
        this.props.onClick();
    }
}
