import {
    LitElement,
    nothing,
    svg,
    css,
    TemplateResult,
    PropertyValues,
} from 'lit';
import {GraphMeta, NUM_AXIS_TYPE, AxisMeta} from '../types';
import {AXIS, AXIS_TYPE, GRAPH, LINE_WIDTH} from '../constants';
import {state} from 'lit/decorators.js';
import {ref, createRef} from 'lit/directives/ref.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = {}> = new (...args: any[]) => T;
type LabelRenderer = (val: number) => string | TemplateResult;
type LineElements = Array<TemplateResult>;
type LabelsArr = SVGTextElement[];
type UpdateLabelsArgs = {
    labelsArr: LabelsArr;
    END: number;
    isYAxis: boolean;
    spacing: number;
};

export declare class LitAxisInterface {
    renderAxis(axisData?: GraphMeta): unknown;
    xEdge: number;
    yEdge: number;
}

const CONSTANTS = {
    MEASUREMENT_OFFSET: -1,
    SPACING_OFFSET: {
        X: 5,
        Y: 1,
    },
};

const defaults = {
    x: {begin: 0, end: 9, interval: 1, type: 'number'},
    y: {begin: 0, end: 9, interval: 1, type: 'number'},
} as GraphMeta;

export const LitAxisMixin = <T extends Constructor<LitElement>>(
    superClass: T
) => {
    class LitAxisClass extends superClass {
        static styles = [
            (superClass as unknown as typeof LitElement).styles ?? [],
            css`
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

        @state()
        private declare isLoading: boolean;

        @state()
        declare xEdge: number;

        @state()
        declare yEdge: number;

        private labels = {
            [AXIS.X]: createRef(),
            [AXIS.Y]: createRef(),
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(...args: any[]) {
            super(args);
            this.isLoading = true;
            this.xEdge = 0;
            this.yEdge = 0;
        }

        /* Generator Methods */

        private generateLine(axis: AXIS, lineElements: LineElements): void {
            const X = GRAPH[AXIS.X];
            const Y = GRAPH[AXIS.Y];

            lineElements.push(svg`
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

        private generateLabels(
            data: AxisMeta<AXIS_TYPE>,
            lineElements: LineElements
        ) {
            if (Array.isArray(data)) {
                this.generateStrLabels(data, lineElements);
            } else {
                this.generateDateNumLabels(data, lineElements);
            }
        }

        private generateStrLabels(
            data: Array<string>,
            lineElements: LineElements
        ): void {
            for (let i = data.length; i > 0; i -= 1) {
                lineElements.push(svg`
                    <text 
                        x="0" 
                        y="0"
                        class="${AXIS_TYPE.STRING}">
                            ${data[i]}
                    </text>
                `);
            }
        }

        private generateLabelRenderer(
            type: AXIS_TYPE,
            interval: number
        ): LabelRenderer {
            if (type === AXIS_TYPE.NUMBER) {
                return (val: number) => val.toString();
            } else if (interval < 3600000) {
                return (val: number) => new Date(val).toLocaleTimeString();
            } else if (interval < 86400000) {
                return (val: number) => {
                    return svg`
                        <tspan>
                            ${new Date(val).toLocaleDateString()}
                        </tspan>
                        <tspan dy="0" dx="0">
                            ${new Date(val).toLocaleTimeString('en-GB')}
                        </tspan>
                    `;
                };
            } else {
                return (val: number) => new Date(val).toLocaleDateString();
            }
        }
        private generateDateNumLabels(
            data: AxisMeta<NUM_AXIS_TYPE>,
            lineElements: LineElements
        ): void {
            const labelRenderer = this.generateLabelRenderer(
                data.type,
                data.interval
            );

            for (let i = data.begin; i < data.end + 1; i += data.interval) {
                lineElements.push(svg`
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

        private updateXDatePos(el: SVGTextElement): void {
            const dateText = el.querySelectorAll('tspan');

            if (dateText.length == 2) {
                const [date, time] = dateText;

                const {width, height} = date.getBBox();

                time.setAttribute('dy', height.toString());
                time.setAttribute('dx', (-width).toString());
            }
        }

        private getDimensionAttr(
            labelsArr: LabelsArr,
            END: number,
            isYAxis: boolean
        ) {
            const totalLabelSize = labelsArr.reduce((size, el) => {
                if (!isYAxis) {
                    this.updateXDatePos(el);
                }
                const {width, height} = el.getBBox();

                return size + (isYAxis ? height : width);
            }, 0);

            return Math.max((END - totalLabelSize) / (labelsArr.length - 1), 0);
        }

        private updateLabels({
            labelsArr,
            END,
            isYAxis,
            spacing,
        }: UpdateLabelsArgs): number {
            const {SPACING_OFFSET} = CONSTANTS;
            let currentPos = 0;
            let labelEdge = 0;

            labelsArr.forEach((el, idx) => {
                const {width, height} = el.getBBox();
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
                } else if (!isYAxis && labelEdge < (y + height)) {
                    labelEdge = y + height;
                }
            });

            return labelEdge;
        }

        private updateMeasurementLabels(axis: AXIS): number {
            const isYAxis = axis === AXIS.Y;
            const {END} = GRAPH[axis];
            const axisElements = this.labels[axis].value;

            if (axisElements) {
                const labelsArr = Array.from(
                    axisElements.querySelectorAll('text')
                );
                const spacing = this.getDimensionAttr(labelsArr, END, isYAxis);

                if (labelsArr.length < 1) {
                    throw new Error('Missing axis elements for updating');
                }
                if (isYAxis) {
                    labelsArr.reverse();
                }

                return this.updateLabels({labelsArr, END, isYAxis, spacing});
            }

            throw new Error('Couldnt find any axis elements to update');
        }

        override firstUpdated(changedProperties: PropertyValues): void {
            super.firstUpdated(changedProperties);
            const xEdge = this.updateMeasurementLabels(AXIS.X);
            const yEdge = this.updateMeasurementLabels(AXIS.Y);
            setTimeout(() => {
                this.isLoading = false;
                this.xEdge = xEdge;
                this.yEdge = yEdge;
            });
        }

        private generateAxis(
            data: AxisMeta<AXIS_TYPE>,
            axis: AXIS
        ): LineElements {
            const lineElements: LineElements = [];
            this.generateLine(axis, lineElements);
            this.generateLabels(data, lineElements);

            return lineElements;
        }

        renderAxis(axisData: GraphMeta = defaults): TemplateResult {
            const {x, y} = axisData;

            return svg`
                <g id="xLabels" ${ref(this.labels[AXIS.X])}>
                    ${this.generateAxis(x, AXIS.X)}
                </g>
                <g id="yLabels" ${ref(this.labels[AXIS.Y])}>
                    ${this.generateAxis(y, AXIS.Y)}
                </g>
                ${
                    this.isLoading
                        ? svg`
                    <rect x="-5" y="0" height="100%" width="105%" fill="white" />
                    <text x="45" y="75">Loading</text>
                `
                        : nothing
                }
            `;
        }
    }
    return LitAxisClass as Constructor<LitAxisInterface> & T;
};
