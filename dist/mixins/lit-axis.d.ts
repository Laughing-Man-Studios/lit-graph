import { LitElement } from 'lit';
import { GraphMeta } from '../types';
declare type Constructor<T = {}> = new (...args: any[]) => T;
export declare class LitAxisInterface {
    renderAxis(axisData?: GraphMeta): unknown;
    xEdge: number;
    yEdge: number;
}
export declare const LitAxisMixin: <T extends Constructor<LitElement>>(superClass: T) => Constructor<LitAxisInterface> & T;
export {};
//# sourceMappingURL=lit-axis.d.ts.map