import { LitElement } from 'lit';
import { Axis } from '../types';
declare type Constructor<T = {}> = new (...args: any[]) => T;
declare type LabelData = Axis<string, string>;
declare type LabelMeta = Axis<number, number>;
export declare class LitLabelInterface {
    renderLabels(labels: LabelData, meta: LabelMeta): unknown;
}
export declare const LitLabelMixin: <T extends Constructor<LitElement>>(superClass: T) => Constructor<LitLabelInterface> & T;
export {};
//# sourceMappingURL=lit-label.d.ts.map