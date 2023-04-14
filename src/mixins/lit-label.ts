import { css,  LitElement, svg } from 'lit';
import { Axis } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = {}> = new (...args: any[]) => T;

export declare class LitLabelInterface {
    renderLabels(axisLabels: Axis<string, string>): unknown;
}

export const LitLabelMixin = <T extends Constructor<LitElement>>(superClass: T) => {
    class LitLabelClass extends superClass {

        static styles = (css` 
            #labels text  {
                x: 100%;
                y: 100%;
            }

            #labels text.y {
                transform: rotate(90deg);
            }
        `);

        renderLabels(axisLabels: Axis<string, string>) {
            const { x, y } = axisLabels;

            return (svg`
                <g id="labels">
                    <text class="x">${x}</text>
                    <text class="y">${y}</text>
                <g>
            `);
        }
    }
    return LitLabelClass as Constructor<LitLabelInterface> & T;
};