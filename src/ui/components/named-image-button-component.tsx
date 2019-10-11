import React from "react";

interface INamedImageButtonProperties<T> {
    id: T;
    image: string;
    name: string;
    onClick: () => void;
}

export default class NamedImageButtonComponent<T> extends React.Component<INamedImageButtonProperties<T>> {
    constructor(props: INamedImageButtonProperties<T>) {
        super(props);
        this._onClick = this._onClick.bind(this);
    }
    public shouldComponentUpdate(nextProps: INamedImageButtonProperties<T>, nextState: Readonly<{}>, nextContext: any) {
        if (nextProps.id === this.props.id
        && (nextProps.image !== this.props.image
        || nextProps.name !== this.props.name
        || nextProps.onClick !== this.props.onClick)) {
            return true;
        }
        return false;
    }
    public render() {
        return <button className="named-image-button" onClick={this._onClick}>
            <div className="named-image-button-container">
                <div className="named-image-button-name">{this.props.name}</div>
                <img className="named-image-button-image" src={this.props.image} />
            </div>
        </button>;
    }
    private _onClick(ev: React.MouseEvent<HTMLButtonElement>) {
        ev.stopPropagation();
        this.props.onClick();
    }
}
