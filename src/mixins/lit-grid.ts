import {LitElement, svg} from 'lit';
import {AXIS, GRAPH} from '../constants';
import {Axis} from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = {}> = new (...args: any[]) => T;

export declare class LitGridInterface {
    renderGrid(axisLengths?: Axis<number, number>): unknown;
}

export const LitGridMixin = <T extends Constructor<LitElement>>(
    superClass: T
) => {
    class LitGridClass extends superClass {
        private renderXAxisLines(xAxisSetLength: number) {
            const lineElements = [];
            const {END, START} = GRAPH[AXIS.Y];
            const interval = END / xAxisSetLength;
            for (let i = 1; i < xAxisSetLength; i += 1) {
                const xCoord = interval * i;
                lineElements.push(svg`
                    <line x1=${xCoord} x2=${xCoord} y1="${START}" y2="${END}" 
                        stroke="gray" stroke-width="0.5" stroke-opacity="0.5"/>
                `);
            }

            return lineElements;
        }

        private renderYAxisLines(yAxisSetLength: number) {
            const lineElements = [];
            const {END, START} = GRAPH[AXIS.X];
            const interval = END / yAxisSetLength;
            for (let i = 1; i < yAxisSetLength; i += 1) {
                const yCoord = interval * i;
                lineElements.push(svg`
                    <line x1="${START}" x2="${END}" y1=${yCoord} y2=${yCoord} 
                        stroke="gray" stroke-width="0.5" stroke-opacity="0.5" />
                `);
            }

            return lineElements;
        }

        renderGrid(axisLengths: Axis<number, number> = {x: 10, y: 10}) {
            const {x, y} = axisLengths;
            return svg`
                <g id="xGridLines">
                    ${this.renderXAxisLines(x)}
                </g>
                <g id="yGridLines">
                    ${this.renderYAxisLines(y)}
                </g>
            `;
        }
    }
    return LitGridClass as Constructor<LitGridInterface> & T;
};
