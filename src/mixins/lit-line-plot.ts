import { css, LitElement, svg, TemplateResult } from 'lit';
import { AXIS, AXIS_TYPE, GRAPH } from '../constants';
import { PlotData, AxisType, AxisData, SingleAxisData, NUM_AXIS_TYPE } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = {}> = new (...args: any[]) => T;
type RenderElements = { circles: Array<TemplateResult>, lines: Array<TemplateResult> };

export declare class LitLinePlotInterface {
    renderLinePlot(data: PlotData, axisData: AxisData): unknown;
}

export const LitLinePlotMixin = <T extends Constructor<LitElement>>(superClass: T) => {
    class LitLinePlotClass extends superClass {

        static styles = (css`
            #PlotCircles circle {
                r: 1.5;
            }

            #PlotLines line {
                stroke: black;
            }
        `);

        private generateStringAxisPosition(
            plot: string, data: SingleAxisData<AXIS_TYPE.STRING>, axis: AXIS
        ): number {
            const { START, END } = GRAPH[axis];

            const plotIndex = data.indexOf(plot);

            if(plotIndex < 0) {
                throw new Error('String Plot doesnt exist in axis data');
            }

            return (END - START) * (plotIndex/data.length);
        }

        private generateNumAxisPosition(
            plot: number, data: SingleAxisData<NUM_AXIS_TYPE>, axis: AXIS
        ): number {
            const { START, END } = GRAPH[axis];
            const position = (END - START) *  (plot - data.begin) / (data.end - data.begin);

            if (axis === AXIS.Y) {
                return END - position;
            }

            return position;
        }

        private getAxisPosition(
            plot: AxisType, data: SingleAxisData<AXIS_TYPE>, axis: AXIS
        ): number {
            if (Array.isArray(data)) {
                if (typeof plot === 'string') {
                    return this.generateStringAxisPosition(plot, data, axis);
                }
                throw new Error('Axis Data is of type string but plot is Number');
            }

            if (typeof plot !== 'number') {
                throw new Error('Axis Data is of type number but plot is String');
            }

            return this.generateNumAxisPosition(plot, data, axis);
        }

        private getElements(
            data: PlotData, 
            axisData: AxisData ): RenderElements {
                const renderElements: RenderElements = { circles: [], lines: []};
                let prev: { x: number, y: number} | null = null;

                for (let i = 0; i < data.length; i++) {
                    const current = data[i];
                    const x = this.getAxisPosition(current.x, axisData.x, AXIS.X);
                    const y = this.getAxisPosition(current.y, axisData.y, AXIS.Y);

                    renderElements.circles.push(svg`<circle cx="${x}" cy="${y}" />`);

                    if (prev) {
                        renderElements.lines.push(svg`
                            <line x1="${prev.x}" y1="${prev.y}" x2="${x}" y2="${y}" />
                        `);
                    }

                    prev = { x, y };
                }

                return renderElements;
        }

        renderLinePlot(data: PlotData, axisData: AxisData) {
            const { circles, lines } = this.getElements(data, axisData);
            
            return (svg`
                <g id="PlotCircles">
                    ${circles}
                </g>
                <g id="PlotLines">
                    ${lines}
                </g>
            `);
        }
    }

    return LitLinePlotClass as Constructor<LitLinePlotInterface> & T;
};