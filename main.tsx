import * as React from "react";
import { render } from "react-dom";
import * as mobx from "mobx";
import * as mobxReact from "mobx-react";
import { InlineMath, BlockMath } from 'react-katex';
import "katex/dist/katex.css";
import * as raw from "core-js/fn/string/raw";
import "bootstrap/scss/bootstrap.scss";
import "jsxgraph/distrib/jsxgraphcore.js";
import * as exampleImg from "./example.png";
import { JXGBoard, FunctionGraph } from './JXG';
import * as Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './style.scss';

const Range = (Slider as any).createSliderWithTooltip(Slider.Range);
@mobxReact.observer
class FourierDemo extends React.Component<{}, {}> {
    @mobx.observable shown = [0, 1];
    max = 10;
    inxToN(i: number) {
        return 2 * i + 1;
    }
    ns = Array.from({ length: this.max + 1 }, (_, k) => this.inxToN(k));
    fns = this.ns.map(n => ({
        n,
        fn: (x: number) => 4 / Math.PI * Math.sin(n * x) / n,
        tex: raw`\frac{\sin ${n} x}{${n}}`
    }));
    render() {
        const [min, max] = this.shown;
        const config = {
            showCopyright: false, showNavigation: false, zoom: { wheel: true }, pan: { needshift: false },
            boundingBox: [-2 * Math.PI, 2, 2 * Math.PI, -2]
        }
        const fns = this.fns.slice(min, max + 1);
        return (
            <div>
                <Range min={0} max={this.max} step={1} value={[min, max]}
                    onChange={(e: any) => this.shown = e}
                    tipFormatter={(i: number) => <InlineMath math={this.fns[i].tex} />}
                />
                <JXGBoard style={{ width: "100%", height: 200 }} options={config}>
                    <FunctionGraph
                        function={(x: number) => fns.map(({ fn }) => fn(x)).reduce((a, b) => a + b, 0)}
                        strokeColor="black" />
                    {fns.length > 1 && fns.map(({ n, fn }, i) =>
                        <FunctionGraph key={n}
                            function={fn}
                            strokeColor={i === fns.length - 1 ? "red" : "green"}
                        />
                    )}
                </JXGBoard>
                <p>Displayed in black: <InlineMath math={raw`\frac{4}{\pi}(${fns.map(fn => fn.tex).join("+")})`} /></p>
                <p style={{ visibility: fns.length > 1 ? "" : "hidden" }}>
                    Displayed in red: <InlineMath math={raw`\frac{4}{\pi}(${fns[fns.length - 1].tex})`} />
                </p>
            </div>
        )
    }
}
const a_n = raw`a_n = & \frac{1}{\pi} \int_{-\pi}^{+\pi} f(x) \cdot \cos n x\,\mathrm{dx} = 0`;
const b_n = raw`b_n = & \frac{1}{\pi} \int_{-\pi}^{+\pi} f(x) \cdot \sin n x\,\mathrm{dx} = \frac{2}{n\pi}(1-(-1)^n)`;
const example = {
    an_bn: raw`
        \begin{array}{rl}
            ${a_n} \\[1em]
            ${b_n}
        \end{array}`,
    f_x: raw`f(x) = \frac{4}{\pi}(\sin x + \frac{\sin 3 x}{3} + \frac{\sin 5 x}{5} + ...)`,
}
@mobxReact.observer
class GUI extends React.Component<{}, {}> {
    render() {
        return (
            <div className="container">
                <div className="mt-4">
                    <h1>Fourier series demo</h1>
                    <hr />
                </div>
                <ul>
                    <li>speech is a superposition of sinoid waves</li>
                    <li>it makes sense to examine the components of a speech signal</li>
                </ul>
                <p>
                    A sum of the kind <InlineMath math={raw`\frac{1}{2} a_0 + a_1 \cos x + b_1 \sin x + a_2 \cos x + b_2 \sin x + ...`} /> is called a trigonometric sum. A benign periodic function <InlineMath>f(x)</InlineMath> with the period <InlineMath>2\pi</InlineMath> can be expressed as a trigonometric sum.
                </p>
                <div>
                    <h3>Example</h3>
                    <InlineMath math={raw`f(x) = \mathbf{sign}(x) \text{ in } [-\pi, +\pi]`} /> and periodic elsewhere: <img src={exampleImg} />
                    <BlockMath math={example.an_bn} />
                    thus:
                    <BlockMath math={example.f_x} />
                </div>
                <FourierDemo />
                <footer><small><a href="https://github.com/phiresky/fourier-series-demo">Source on GitHub</a></small></footer>
            </div>
        );
    }
}

render(<GUI />, document.getElementById("app"));