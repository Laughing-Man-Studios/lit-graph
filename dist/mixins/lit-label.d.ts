import { LitElement } from 'lit';
import { Axis } from '../types';
declare type Constructor<T = {}> = new (...args: any[]) => T;
export declare class LitLabelInterface {
    renderLabels(axisLabels: Axis<string, string>): unknown;
}
export declare const LitLabelMixin: <T extends Constructor<LitElement>>(superClass: T) => Constructor<LitLabelInterface> & T;
export {};
//# sourceMappingURL=lit-label.d.ts.map