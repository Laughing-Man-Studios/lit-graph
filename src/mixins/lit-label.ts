import { css,  LitElement, svg } from 'lit';
import { Axis } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = {}> = new (...args: any[]) => T;
type LabelData = Axis<string, string>;
type LabelMeta = Axis<number, number>;

export declare class LitLabelInterface {
    renderLabels(labels: LabelData, meta: LabelMeta): unknown;
}

export const LitLabelMixin = <T extends Constructor<LitElement>>(superClass: T) => {
    class LitLabelClass extends superClass {

        static styles = [
            (superClass as unknown as typeof LitElement).styles ?? [],
            (css` 
                #labels text {
                    transform-box: fill-box;
                    transform-origin: center;
                }
                #labels text.y {
                    transform: translate(-57%, -50%) rotate(-90deg);
                }
                #labels text.x {
                    transform: translate(-50%, 50%);
                }
            `)
        ];

        renderLabels(labels: LabelData, meta: LabelMeta) {
            const { x: xLabel, y:  yLabel } = labels;
            const { x: xPos, y: yPos } = meta;

            return (svg`
                <g id="labels">
                    <text class="x" x="50%" y="${xPos}">${xLabel}</text>
                    <text class="y" y="50%" x="${yPos}">${yLabel}</text>
                </g>
            `);
        }
    }
    return LitLabelClass as Constructor<LitLabelInterface> & T;
};