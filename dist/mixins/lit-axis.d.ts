import { LitElement } from 'lit';
import { AxisData } from '../types';
import { AXIS_TYPE } from '../constants';
declare type Constructor<T = {}> = new (...args: any[]) => T;
export declare class LitAxisInterface {
    renderAxis(axisData?: AxisData<AXIS_TYPE, AXIS_TYPE>): unknown;
}
export declare const LitAxisMixin: <T extends Constructor<LitElement>>(superClass: T) => Constructor<LitAxisInterface> & T;
export {};
//# sourceMappingURL=lit-axis.d.ts.map