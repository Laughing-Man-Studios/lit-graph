import { svg } from 'lit';
import { AXIS, GRAPH } from '../constants';
export const LitGridMixin = (superClass) => {
    class LitGridClass extends superClass {
        renderXAxisLines(xAxisSetLength) {
            const lineElements = [];
            const { END, START } = GRAPH[AXIS.Y];
            const interval = END / xAxisSetLength;
            for (let i = 1; i < xAxisSetLength; i += 1) {
                const xCoord = interval * i;
                lineElements.push(svg `
                    <line x1=${xCoord} x2=${xCoord} y1="${START}" y2="${END}" 
                        stroke="gray" stroke-width="0.5" stroke-opacity="0.5"/>
                `);
            }
            return lineElements;
        }
        renderYAxisLines(yAxisSetLength) {
            const lineElements = [];
            const { END, START } = GRAPH[AXIS.X];
            const interval = END / yAxisSetLength;
            for (let i = 1; i < yAxisSetLength; i += 1) {
                const yCoord = interval * i;
                lineElements.push(svg `
                    <line x1="${START}" x2="${END}" y1=${yCoord} y2=${yCoord} 
                        stroke="gray" stroke-width="0.5" stroke-opacity="0.5" />
                `);
            }
            return lineElements;
        }
        renderGrid(axisLengths = { x: 10, y: 10 }) {
            const { x, y } = axisLengths;
            return svg `
                <g id="xGridLines">
                    ${this.renderXAxisLines(x)}
                </g>
                <g id="yGridLines">
                    ${this.renderYAxisLines(y)}
                </g>
            `;
        }
    }
    return LitGridClass;
};
//# sourceMappingURL=lit-grid.js.map