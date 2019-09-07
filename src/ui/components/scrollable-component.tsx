import * as React from "react";
import ReactResizeDetector from "react-resize-detector";

interface IScrollableProperties {
    autoscroll: boolean;
    class: string;
}

interface IScrollableState {
    scrollTop: number;
    innerHeight: number;
    outerHeight: number;
}

const AS_LENIENCY = 4;

export default class ScrollableComponent extends React.Component<IScrollableProperties, IScrollableState>{
    private ref: React.RefObject<HTMLDivElement>;
    constructor(props: IScrollableProperties) {
        super(props);
        this.ref = React.createRef<HTMLDivElement>();
        this.state = {scrollTop: 0, innerHeight: 0, outerHeight: 0};
        this.updateScrollState = this.updateScrollState.bind(this);
        this.updateInnerHeightState = this.updateInnerHeightState.bind(this);
        this.updateOuterHeightState = this.updateOuterHeightState.bind(this);
    }
    public render() {
        return <div className={`scrollable ${this.props.class}`}  onScroll={this.updateScrollState} ref={this.ref}>
            <div className="scrollable-contents">
                {this.props.children}
                <ReactResizeDetector handleHeight onResize={this.updateInnerHeightState} />
            </div>
            <ReactResizeDetector handleHeight onResize={this.updateOuterHeightState} />
        </div>;
    }
    public componentDidUpdate() {
        if (this.ref.current !== null) {
            this.ref.current.scrollTop = this.state.scrollTop;
        }
    }
    private updateScrollState(ev: React.UIEvent<HTMLDivElement>) {
        this.setState({
            scrollTop: (ev.target as any).scrollTop,
        });
    }
    private updateInnerHeightState(newWidth: number, newHeight: number) {
        if (this.props.autoscroll) {
            if (this.state.scrollTop + this.state.outerHeight + AS_LENIENCY >= this.state.innerHeight) {
                this.scrollTo(newHeight - this.state.outerHeight);
            }
            this.setState({innerHeight: newHeight});
        }
    }
    private updateOuterHeightState(newWidth: number, newHeight: number) {
        if (this.props.autoscroll) {
            if (this.state.scrollTop + this.state.outerHeight + AS_LENIENCY >= this.state.innerHeight) {
                this.scrollTo(this.state.innerHeight - newHeight);
            }
            this.setState({outerHeight: newHeight});
        }
    }
    private scrollTo(height: number) {
        this.setState({scrollTop: height});
    }
}
