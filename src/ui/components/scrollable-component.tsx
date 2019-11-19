import * as React from "react";
import ReactResizeDetector from "react-resize-detector";

interface ScrollableProperties {
    autoscroll: boolean;
    class: string;
}

interface ScrollableState {
    scrollTop: number;
    innerHeight: number;
    outerHeight: number;
}

const AS_LENIENCY = 4;

export default class ScrollableComponent extends React.Component<ScrollableProperties, ScrollableState>{
    private ref: React.RefObject<HTMLDivElement>;
    constructor(props: ScrollableProperties) {
        super(props);
        this.ref = React.createRef<HTMLDivElement>();
        this.state = {scrollTop: 0, innerHeight: 0, outerHeight: 0};
        this._updateScrollState = this._updateScrollState.bind(this);
        this._updateInnerHeightState = this._updateInnerHeightState.bind(this);
        this._updateOuterHeightState = this._updateOuterHeightState.bind(this);
    }
    public render() {
        return <div className={`scrollable ${this.props.class}`}  onScroll={this._updateScrollState} ref={this.ref}>
            <div className="scrollable-contents">
                {this.props.children}
                <ReactResizeDetector handleHeight onResize={this._updateInnerHeightState} />
            </div>
            <ReactResizeDetector handleHeight onResize={this._updateOuterHeightState} />
        </div>;
    }
    public componentDidUpdate() {
        if (this.ref.current !== null) {
            this.ref.current.scrollTop = this.state.scrollTop;
        }
    }
    private _updateScrollState(ev: React.UIEvent<HTMLDivElement>) {
        this.setState({
            scrollTop: (ev.target as any).scrollTop,
        });
    }
    private _updateInnerHeightState(newWidth: number, newHeight: number) {
        if (this.props.autoscroll) {
            if (this.state.scrollTop + this.state.outerHeight + AS_LENIENCY >= this.state.innerHeight) {
                this._scrollTo(newHeight - this.state.outerHeight);
            }
            this.setState({innerHeight: newHeight});
        }
    }
    private _updateOuterHeightState(newWidth: number, newHeight: number) {
        if (this.props.autoscroll) {
            if (this.state.scrollTop + this.state.outerHeight + AS_LENIENCY >= this.state.innerHeight) {
                this._scrollTo(this.state.innerHeight - newHeight);
            }
            this.setState({outerHeight: newHeight});
        }
    }
    private _scrollTo(height: number) {
        this.setState({scrollTop: height});
    }
}
