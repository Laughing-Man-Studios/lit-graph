import { LitElement, nothing, svg, TemplateResult } from 'lit';
import { Axis, AxisData, AxisCoords } from '../types';
import { AXIS, AXIS_TYPE, GRAPH } from '../constants';
import { state } from 'lit/decorators.js';
import { ref, createRef } from 'lit/directives/ref.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = {}> = new (...args: any[]) => T;

export declare class LitAxisInterface {
    renderAxis(axisData?: Axis<AxisData<AXIS_TYPE>>): unknown;
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
    },
    FONT_SIZE: {
        [AXIS_TYPE.DATE]: 4,
        [AXIS_TYPE.NUMBER]: 6,
        [AXIS_TYPE.STRING]: 4
    }
};

const defaults = {
    x: { begin: 0, end: 9, interval: 1, type: 'number' },
    y: { begin: 0, end: 9, interval: 1, type: 'number'}
} as Axis<AxisData<AXIS_TYPE.NUMBER>>;

type DateNum = AXIS_TYPE.DATE | AXIS_TYPE.NUMBER;
type LabelRenderer = (val: number) => string | TemplateResult;
type LineElements = Array<TemplateResult>;

export const LitAxisMixin = <T extends Constructor<LitElement>>(superClass: T) => {
    class LitAxisClass extends superClass {
        
        @state()
        private isLoading = true;

        private labels = {
            [AXIS.X]: createRef(),
            [AXIS.Y]: createRef()
        };

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

        private generateStrLabels(data: Array<string>, lineElements: LineElements): void {
            const { FONT_SIZE } = CONSTANTS;
            for (let i = data.length; i > 0; i -= 1) {
                lineElements.push(svg`
                    <text 
                        x="0" 
                        y="0" 
                        font-size="${FONT_SIZE[AXIS_TYPE.STRING]}px">
                            ${data[i]}
                    </text>
                `)
            }
        }

        private generateLabelRenderer(type: AXIS_TYPE, interval: number): LabelRenderer {
            if (type === AXIS_TYPE.NUMBER) {
                return (val: number) => val.toString();
            } else if (interval < 3600000) {
                return (val: number) => new Date(val).toLocaleTimeString();
            } else if (interval < 86400000) {
                return (val: number) => {
                    return svg`
                        <tspan font-size="4px">
                            ${new Date(val).toLocaleDateString()}
                        </tspan>
                        <tspan dy="0" dx="0" font-size="4px">
                            ${new Date(val).toLocaleTimeString('en-GB')}
                        </tspan>
                    `
                };
            } else {
                return (val: number) => new Date(val).toLocaleDateString();
            }
        }
        private generateDateNumLabels(data: AxisData<DateNum>, lineElements: LineElements): void {
            const { FONT_SIZE } = CONSTANTS;
            const labelRenderer = this.generateLabelRenderer(data.type, data.interval);
            
            for (let i = data.begin; i < data.end + 1; i += data.interval) {
                lineElements.push(svg`
                    <text 
                        x="0" 
                        y="0"
                        font-size="${FONT_SIZE[data.type]}px">
                            ${labelRenderer(i)}
                    </text>
                `);
            }
    }

        private generateAxis(data: AxisData<AXIS_TYPE>, axis: AXIS): LineElements {
            const lineElements: Array<TemplateResult> = []; 
            this.generateLine(axis, lineElements);
            if (Array.isArray(data)) {
                this.generateStrLabels(data, lineElements);
            } else {
                this.generateDateNumLabels(data, lineElements);
            }

            return lineElements
        }

        private updateXDatePos(el: SVGTextElement): void {
            const dateText = el.querySelectorAll('tspan');

            if (dateText.length == 2) {
                const [ date, time ] = dateText;

                const { width, height } = date.getBBox();
    
                time.setAttribute('dy', height.toString());
                time.setAttribute('dx', (-width).toString());
            }
        }

        private updateMeasurementLabels(axis: AXIS): void {
            const graphAxisCoords = (this as unknown as LitGraphCoords)?.graph;
            // const viewBoxCoords = (this as unknown as LitGraphCoords)?.viewBox;
            const { SPACING_OFFSET } = CONSTANTS;
            const isYAxis = axis === AXIS.Y;
            const END = graphAxisCoords ? graphAxisCoords[axis].END :  GRAPH[axis].END;
            // const START = graphAxisCoords ? graphAxisCoords[axis].START :  GRAPH[axis].START;
            const labels = this.labels[axis].value?.querySelectorAll('text');
            let labelEdge = 0;

            if (labels?.[Symbol.iterator]) {
                const labelsArr = Array.from(labels);
                const totalLabelSize = labelsArr.reduce((size, el) => {
                    if (!isYAxis) {
                        this.updateXDatePos(el);
                    }
                    const { width, height } = el.getBBox();
                    
                    return size + (isYAxis ? height : width); 
                }, 0);
                const spacing = Math.max((END - totalLabelSize)/labelsArr.length, 0);
                let currentPos = 0;
                
                if(isYAxis) {
                    labelsArr.reverse();
                }

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


                if (totalLabelSize > END && graphAxisCoords) {
                    const newGraphAxisCoords = { ...graphAxisCoords };
                    
                    newGraphAxisCoords[axis].END = totalLabelSize;
                    (this as unknown as LitGraphCoords).graph = newGraphAxisCoords;
                }
            }
        }

        override firstUpdated(): void {
            this.updateMeasurementLabels(AXIS.X);
            this.updateMeasurementLabels(AXIS.Y);
            this.isLoading = false;
        }

        renderAxis(axisData: Axis<AxisData<AXIS_TYPE>> = defaults): TemplateResult {
            const { x, y } = axisData;

            return svg`
                <g ${ref(this.labels[AXIS.X])}>
                    ${this.generateAxis(x, AXIS.X)}
                </g>
                <g ${ref(this.labels[AXIS.Y])}>
                    ${this.generateAxis(y, AXIS.Y)}
                </g>
                ${this.isLoading ? svg `
                    <rect x="-5" y="0" height="100%" width="105%" fill="white" />
                    <text x="45" y="75">Loading</text>
                ` : nothing}
            `
        }
    }
    return LitAxisClass as Constructor<LitAxisInterface> & T;
}

