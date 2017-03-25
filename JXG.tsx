import * as React from "react";
import * as mobxReact from "mobx-react";

declare var JXG: any;

export class JXGBoard extends React.Component<{ style?: any, options: any }, {}> {
    static boardId = 1;
    boardId = JXGBoard.boardId++;
    board: any;
    div: any;
    static childContextTypes = {
        board: React.PropTypes.object
    };
    componentDidMount() {
        this.board = JXG.JSXGraph.initBoard(this.div.id, { boundingBox: [-3, 10, 3, -3], axis: true, ...this.props.options });
        this.forceUpdate();
    }
    getChildContext() {
        return { board: this.board };
    }
    render() {
        return <div className="jxgbox" style={this.props.style} id={`jxgboard-${this.boardId}}`} ref={d => this.div = d}>
            {this.board && this.props.children}
        </div>;
    }
}

@mobxReact.observer
export class FunctionGraph extends React.Component<{ function: (x: number) => number, min?: number, max?: number, [name: string]: any }, {}> {
    functionGraph: any;
    static contextTypes = {
        board: React.PropTypes.object
    };
    componentWillMount() {
        if (!this.context.board) throw Error("FunctionGraph must be created within JXGBoard context");
        const { function: fn, min = -20, max = 20, ...options } = this.props;
        this.functionGraph = this.context.board.create('functiongraph', [fn, min, max], options);
    }
    //called only if shouldComponentUpdate returns true, before each render
    //use to update JSXGraph elements when props or state changes
    componentWillUpdate(nextProps: any, nextState: any, nextContext: any) {
        const { function: fn, min = -20, max = 20, ...options } = nextProps;
        if (this.props.function !== fn) {
            this.functionGraph.Y = fn;
            this.functionGraph.updateCurve();
            this.context.board.update();
        }
        for (const option in options) {
            // this api is disgusting
            this.functionGraph.setAttribute(option + ":" + options[option]);
        }
    }
    componentWillUnmount() {
        this.context.board.removeObject(this.functionGraph);
    }
    render() {
        return null;
    }
}