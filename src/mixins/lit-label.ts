import { css,  LitElement, svg } from 'lit';
import { Axis } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = {}> = new (...args: any[]) => T;

export declare class LitLabelInterface {
    renderLabels(axisLabels: Axis<string, string>): unknown;
}

export const LitLabelMixin = <T extends Constructor<LitElement>>(superClass: T) => {
    class LitLabelClass extends superClass {

        static styles = [
            (superClass as unknown as typeof LitElement).styles ?? [],
            (css` 
                #labels text.y {
                    transform-box: fill-box;
                    transform: rotate(-90deg);
                    transform-origin: center;
                }
            `)
        ];

        renderLabels(axisLabels: Axis<string, string>) {
            const { x, y } = axisLabels;

            return (svg`
                <g id="labels">
                    <text class="x" x="50%" y="100%">${x}</text>
                    <text class="y" y="50%">${y}</text>
                <g>
            `);
        }
    }
    return LitLabelClass as Constructor<LitLabelInterface> & T;
};