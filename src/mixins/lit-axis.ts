import { LitElement, nothing, svg, css, TemplateResult } from 'lit';
import { Axis, AxisData, AxisCoords } from '../types';
import { AXIS, AXIS_TYPE, GRAPH } from '../constants';
import { state } from 'lit/decorators.js';
import { ref, createRef } from 'lit/directives/ref.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = {}> = new (...args: any[]) => T;
type DateNum = AXIS_TYPE.DATE | AXIS_TYPE.NUMBER;
type LabelRenderer = (val: number) => string | TemplateResult;
type LineElements = Array<TemplateResult>;
type LabelsArr = SVGTextElement[];

export declare class LitAxisInterface {
    renderAxis(axisData?: Axis<AxisData<AXIS_TYPE>, AxisData<AXIS_TYPE>>): unknown;
}

interface LitGraphCoords {
    graph?: AxisCoords;
    viewBox?: AxisCoords;
}

const CONSTANTS = {
    MEASUREMENT_OFFSET: -1,
    SPACING_OFFSET: {
        X: 5,
        Y: 1
    }
};

const defaults = {
    x: { begin: 0, end: 9, interval: 1, type: 'number' },
    y: { begin: 0, end: 9, interval: 1, type: 'number' }
} as Axis<AxisData<AXIS_TYPE.NUMBER>, AxisData<AXIS_TYPE.NUMBER>>;

export const LitAxisMixin = <T extends Constructor<LitElement>>(superClass: T) => {
    class LitAxisClass extends superClass {

    static styles = (css`
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
    `);
        
        @state()
        declare private isLoading;

        private labels = {
            [AXIS.X]: createRef(),
            [AXIS.Y]: createRef()
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(...args: any[]) {
            super(args);
            this.isLoading = true;
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

        private generateLabels(data: AxisData<AXIS_TYPE>, lineElements: LineElements){
            if (Array.isArray(data)) {
                this.generateStrLabels(data, lineElements);
            } else {
                this.generateDateNumLabels(data, lineElements);
            }
        }

        private generateStrLabels(data: Array<string>, lineElements: LineElements): void {
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

        private generateLabelRenderer(type: AXIS_TYPE, interval: number): LabelRenderer {
            if (type === AXIS_TYPE.NUMBER) {
                return (val: number) => val.toString();
            } else if (interval < 3600000) {
                return (val: number) => new Date(val).toLocaleTimeString();
            } else if (interval < 86400000) {
                return (val: number) => {
                    return (svg`
                        <tspan>
                            ${new Date(val).toLocaleDateString()}
                        </tspan>
                        <tspan dy="0" dx="0">
                            ${new Date(val).toLocaleTimeString('en-GB')}
                        </tspan>
                    `);
                };
            } else {
                return (val: number) => new Date(val).toLocaleDateString();
            }
        }
        private generateDateNumLabels(data: AxisData<DateNum>, lineElements: LineElements): void {
            const labelRenderer = this.generateLabelRenderer(data.type, data.interval);
            
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
                const [ date, time ] = dateText;

                const { width, height } = date.getBBox();
    
                time.setAttribute('dy', height.toString());
                time.setAttribute('dx', (-width).toString());
            }
        }

        private getDimensionAttr(labelsArr: LabelsArr, END: number, isYAxis: boolean) {
            const totalLabelSize = labelsArr.reduce((size, el) => {
                if (!isYAxis) {
                    this.updateXDatePos(el);
                }
                const { width, height } = el.getBBox();
                
                return size + (isYAxis ? height : width); 
            }, 0);

            return Math.max((END - totalLabelSize)/labelsArr.length, 0);
        }

        private updateLabels(labelsArr: LabelsArr, END: number, isYAxis: boolean, spacing: number) {
            const { SPACING_OFFSET } = CONSTANTS;
            let currentPos = 0;
            let labelEdge = 0;

            labelsArr.forEach((el) => {
                const { width, height } = el.getBBox();
                const x = isYAxis ? -(width + SPACING_OFFSET.Y) : currentPos - (width/2);
                const y = isYAxis ? currentPos + spacing + height : END + SPACING_OFFSET.X;

                el.setAttribute('x', x.toString());
                el.setAttribute('y', y.toString());

                currentPos += (isYAxis ? height : width) + spacing;

                if (isYAxis && labelEdge > x) {
                    labelEdge = x;
                } else if (labelEdge < y) {
                    labelEdge = y;
                }
            });
        }

        private updateMeasurementLabels(axis: AXIS): void {
            const graphAxisCoords = (this as unknown as LitGraphCoords)?.graph || null;
            const isYAxis = axis === AXIS.Y;
            const END = graphAxisCoords ? graphAxisCoords[axis].END :  GRAPH[axis].END;
            const labels = this.labels[axis].value?.querySelectorAll('text');
            

            if (labels?.[Symbol.iterator]) {
                const labelsArr = Array.from(labels);
                const spacing = this.getDimensionAttr(labelsArr, END, isYAxis);
                
                if(isYAxis) {
                    labelsArr.reverse();
                }

                this.updateLabels(labelsArr, END, isYAxis, spacing);
            }
        }

        override firstUpdated(): void {
            this.updateMeasurementLabels(AXIS.X);
            this.updateMeasurementLabels(AXIS.Y);
            setTimeout(() => {
                this.isLoading = false;
            });
            
        }

        private generateAxis(data: AxisData<AXIS_TYPE>, axis: AXIS): LineElements {
            const lineElements: LineElements = []; 
            this.generateLine(axis, lineElements);
            this.generateLabels(data, lineElements);

            return lineElements;
        }

        renderAxis(
            axisData: Axis<AxisData<AXIS_TYPE>, AxisData<AXIS_TYPE>> = defaults
            ): TemplateResult {
            const { x, y } = axisData;

            return (svg`
                <g id="xLabels" ${ref(this.labels[AXIS.X])}>
                    ${this.generateAxis(x, AXIS.X)}
                </g>
                <g id="yLabels" ${ref(this.labels[AXIS.Y])}>
                    ${this.generateAxis(y, AXIS.Y)}
                </g>
                ${this.isLoading ? svg `
                    <rect x="-5" y="0" height="100%" width="105%" fill="white" />
                    <text x="45" y="75">Loading</text>
                ` : nothing}
            `);
        }
    }
    return LitAxisClass as Constructor<LitAxisInterface> & T;
};

