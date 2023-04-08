import { LitElement } from 'lit';
import { AxisLengths } from '../types';
declare type Constructor<T = {}> = new (...args: any[]) => T;
export declare class LitGridInterface {
    renderGrid(axisLengths?: AxisLengths): unknown;
}
export declare const LitGridMixin: <T extends Constructor<LitElement>>(superClass: T) => Constructor<LitGridInterface> & T;
export {};
//# sourceMappingURL=lit-grid.d.ts.map