var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { nothing, svg, css, } from 'lit';
import { AXIS, AXIS_TYPE, GRAPH, LINE_WIDTH } from '../constants';
import { state } from 'lit/decorators.js';
import { ref, createRef } from 'lit/directives/ref.js';
const CONSTANTS = {
    MEASUREMENT_OFFSET: -1,
    SPACING_OFFSET: {
        X: 5,
        Y: 1,
    },
};
const defaults = {
    x: { begin: 0, end: 9, interval: 1, type: 'number' },
    y: { begin: 0, end: 9, interval: 1, type: 'number' },
};
export const LitAxisMixin = (superClass) => {
    var _a;
    class LitAxisClass extends superClass {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(...args) {
            super(args);
            this.labels = {
                [AXIS.X]: createRef(),
                [AXIS.Y]: createRef(),
            };
            this.isLoading = true;
            this.xEdge = 0;
            this.yEdge = 0;
        }
        /* Generator Methods */
        generateLine(axis, lineElements) {
            const X = GRAPH[AXIS.X];
            const Y = GRAPH[AXIS.Y];
            lineElements.push(svg `
                <line
                    x1="${X.START}" 
                    y1="${axis === AXIS.X ? Y.END : Y.START}" 
                    x2="${axis === AXIS.X ? X.END : X.START}" 
                    y2="${Y.END}"
                    stoke-width="0.5"
                    stroke="black"
                >
            `);
        }
        generateLabels(data, lineElements) {
            if (Array.isArray(data)) {
                this.generateStrLabels(data, lineElements);
            }
            else {
                this.generateDateNumLabels(data, lineElements);
            }
        }
        generateStrLabels(data, lineElements) {
            for (let i = data.length; i > 0; i -= 1) {
                lineElements.push(svg `
                    <text 
                        x="0" 
                        y="0"
                        class="${AXIS_TYPE.STRING}">
                            ${data[i]}
                    </text>
                `);
            }
        }
        generateLabelRenderer(type, interval) {
            if (type === AXIS_TYPE.NUMBER) {
                return (val) => val.toString();
            }
            else if (interval < 3600000) {
                return (val) => new Date(val).toLocaleTimeString();
            }
            else if (interval < 86400000) {
                return (val) => {
                    return svg `
                        <tspan>
                            ${new Date(val).toLocaleDateString()}
                        </tspan>
                        <tspan dy="0" dx="0">
                            ${new Date(val).toLocaleTimeString('en-GB')}
                        </tspan>
                    `;
                };
            }
            else {
                return (val) => new Date(val).toLocaleDateString();
            }
        }
        generateDateNumLabels(data, lineElements) {
            const labelRenderer = this.generateLabelRenderer(data.type, data.interval);
            for (let i = data.begin; i < data.end + 1; i += data.interval) {
                lineElements.push(svg `
                    <text 
                        x="0" 
                        y="0"
                        class="${data.type}">
                            ${labelRenderer(i)}
                    </text>
                `);
            }
        }
        /* Update Methods */
        updateXDatePos(el) {
            const dateText = el.querySelectorAll('tspan');
            if (dateText.length == 2) {
                const [date, time] = dateText;
                const { width, height } = date.getBBox();
                time.setAttribute('dy', height.toString());
                time.setAttribute('dx', (-width).toString());
            }
        }
        getDimensionAttr(labelsArr, END, isYAxis) {
            const totalLabelSize = labelsArr.reduce((size, el) => {
                if (!isYAxis) {
                    this.updateXDatePos(el);
                }
                const { width, height } = el.getBBox();
                return size + (isYAxis ? height : width);
            }, 0);
            return Math.max((END - totalLabelSize) / (labelsArr.length - 1), 0);
        }
        updateLabels({ labelsArr, END, isYAxis, spacing, }) {
            const { SPACING_OFFSET } = CONSTANTS;
            let currentPos = 0;
            let labelEdge = 0;
            labelsArr.forEach((el, idx) => {
                const { width, height } = el.getBBox();
                const spacingSize = isYAxis && idx === 0 ? 0 : spacing;
                const x = isYAxis
                    ? -(width + SPACING_OFFSET.Y)
                    : currentPos - width / 2;
                const y = isYAxis
                    ? currentPos + spacingSize + height
                    : END + SPACING_OFFSET.X + LINE_WIDTH;
                el.setAttribute('x', x.toString());
                el.setAttribute('y', y.toString());
                currentPos += (isYAxis ? height : width) + spacingSize;
                if (isYAxis && labelEdge > x) {
                    labelEdge = x;
                }
                else if (!isYAxis && labelEdge < y + height) {
                    labelEdge = y + height;
                }
            });
            return labelEdge;
        }
        updateMeasurementLabels(axis) {
            const isYAxis = axis === AXIS.Y;
            const { END } = GRAPH[axis];
            const axisElements = this.labels[axis].value;
            const labelsArr = Array.from(axisElements.querySelectorAll('text'));
            const spacing = this.getDimensionAttr(labelsArr, END, isYAxis);
            if (labelsArr.length < 1) {
                throw new Error('Missing axis elements for updating');
            }
            if (isYAxis) {
                labelsArr.reverse();
            }
            return this.updateLabels({ labelsArr, END, isYAxis, spacing });
        }
        firstUpdated(changedProperties) {
            super.firstUpdated(changedProperties);
            const xEdge = this.updateMeasurementLabels(AXIS.X);
            const yEdge = this.updateMeasurementLabels(AXIS.Y);
            setTimeout(() => {
                this.isLoading = false;
                this.xEdge = xEdge;
                this.yEdge = yEdge;
            });
        }
        generateAxis(data, axis) {
            const lineElements = [];
            this.generateLine(axis, lineElements);
            this.generateLabels(data, lineElements);
            return lineElements;
        }
        renderAxis(axisData = defaults) {
            const { x, y } = axisData;
            return svg `
                <g id="xLabels" ${ref(this.labels[AXIS.X])}>
                    ${this.generateAxis(x, AXIS.X)}
                </g>
                <g id="yLabels" ${ref(this.labels[AXIS.Y])}>
                    ${this.generateAxis(y, AXIS.Y)}
                </g>
                ${this.isLoading
                ? svg `
                    <rect x="-5" y="0" height="100%" width="105%" fill="white" />
                    <text x="45" y="75">Loading</text>
                `
                : nothing}
            `;
        }
    }
    LitAxisClass.styles = [
        (_a = superClass.styles) !== null && _a !== void 0 ? _a : [],
        css `
                text {
                    font-family: serif;
                }
                text.date,
                text.string {
                    font-size: 4px;
                }
                text.number {
                    font-size: 6px;
                }
                #xLabels line {
                    stroke-width: ${LINE_WIDTH};
                }
                #yLabels line {
                    stroke-width: ${LINE_WIDTH};
                }
            `,
    ];
    __decorate([
        state()
    ], LitAxisClass.prototype, "isLoading", void 0);
    __decorate([
        state()
    ], LitAxisClass.prototype, "xEdge", void 0);
    __decorate([
        state()
    ], LitAxisClass.prototype, "yEdge", void 0);
    return LitAxisClass;
};
//# sourceMappingURL=lit-axis.js.map