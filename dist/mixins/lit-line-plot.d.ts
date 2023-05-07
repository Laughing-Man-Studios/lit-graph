import { LitElement } from 'lit';
import { PlotData, GraphMeta } from '../types';
declare type Constructor<T = {}> = new (...args: any[]) => T;
export declare class LitLinePlotInterface {
    renderLinePlot(data: PlotData, axisData: GraphMeta): unknown;
}
export declare const LitLinePlotMixin: <T extends Constructor<LitElement>>(superClass: T) => Constructor<LitLinePlotInterface> & T;
export {};
//# sourceMappingURL=lit-line-plot.d.ts.map