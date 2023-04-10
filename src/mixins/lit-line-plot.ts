import { LitElement, svg } from 'lit';
import { AXIS, AXIS_TYPE, GRAPH } from '../constants';
import { PlotData, Axis, AxisType, AxisData, SingleAxisData, NUM_AXIS_TYPE } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = {}> = new (...args: any[]) => T;

export declare class LitLinePlotInterface {
    renderLinePlot(data: PlotData, axisData: AxisData<AXIS_TYPE, AXIS_TYPE>): unknown;
}

export const LitLinePlotMixin = <T extends Constructor<LitElement>>(superClass: T) => {
    class LitLinePlotClass extends superClass {

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

            return (END -START) * (data.end - data.begin) / plot;
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

        private getPosition(
            plot: Axis<AxisType, AxisType>, 
            axisData: AxisData<AXIS_TYPE, AXIS_TYPE> ): Axis<number, number> {
            
                return {
                    x: this.getAxisPosition(plot.x, axisData.x, AXIS.X),
                    y: this.getAxisPosition(plot.y, axisData.y, AXIS.Y)
                };
        }

        renderLinePlot(data: PlotData, axisData: AxisData<AXIS_TYPE, AXIS_TYPE>) {
            return (svg`
                <g>
                    ${data.map((plot) => {
                        const { x, y } = this.getPosition(plot, axisData);
                        return (svg`<circle cx="${x}" cy="${y}" r="2">`);
                    })}
                </g>
            `);
        }
    }

    return LitLinePlotClass as Constructor<LitLinePlotInterface> & T;
};