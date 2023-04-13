import { LitElement, svg } from 'lit';
import { Axis } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = {}> = new (...args: any[]) => T;

export declare class LitLabelInterface {
    renderLabel(axisLabels: Axis<string, string>): unknown;
}

export const LitLabelMixin = <T extends Constructor<LitElement>>(superClass: T) => {
    class LitLabelClass extends superClass {
        renderLabel(axisLabels: Axis<string, string>) {
            const { x, y } = axisLabels;

            return (svg`
                <text>${x}</text>
                <text>${y}</text>
            `);
        }
    }
    return LitLabelClass as Constructor<LitLabelInterface> & T;
};