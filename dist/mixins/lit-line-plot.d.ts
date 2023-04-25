import { LitElement } from 'lit';
import { AXIS_TYPE } from '../constants';
import { PlotData, AxisData } from '../types';
declare type Constructor<T = {}> = new (...args: any[]) => T;
export declare class LitLinePlotInterface {
    renderLinePlot(data: PlotData, axisData: AxisData<AXIS_TYPE, AXIS_TYPE>): unknown;
}
export declare const LitLinePlotMixin: <T extends Constructor<LitElement>>(superClass: T) => Constructor<LitLinePlotInterface> & T;
export {};
//# sourceMappingURL=lit-line-plot.d.ts.map