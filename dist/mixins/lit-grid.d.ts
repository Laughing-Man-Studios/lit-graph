import { LitElement } from 'lit';
import { Axis } from '../types';
declare type Constructor<T = {}> = new (...args: any[]) => T;
export declare class LitGridInterface {
    renderGrid(axisLengths?: Axis<number>): unknown;
}
export declare const LitGridMixin: <T extends Constructor<LitElement>>(superClass: T) => Constructor<LitGridInterface> & T;
export {};
//# sourceMappingURL=lit-grid.d.ts.map