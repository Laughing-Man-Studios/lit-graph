import { svg } from 'lit';
export const LitGridMixin = (superClass) => {
    class LitGridClass extends superClass {
        renderXAxisLines(xAxisSetLength) {
            const lineElements = [];
            const interval = 100 / xAxisSetLength;
            for (let i = 1; i < xAxisSetLength; i += 1) {
                const xCoord = interval * i;
                lineElements.push(svg `
                    <line x1=${xCoord} x2=${xCoord} y1="0" y2="100" 
                        stroke="gray" stroke-width="0.5" stroke-opacity="0.5"/>
                `);
            }
            return lineElements;
        }
        renderYAxisLines(yAxisSetLength) {
            const lineElements = [];
            const interval = 100 / yAxisSetLength;
            for (let i = 1; i < yAxisSetLength; i += 1) {
                const yCoord = interval * i;
                lineElements.push(svg `
                    <line x1="0" x2="100" y1=${yCoord} y2=${yCoord} 
                        stroke="gray" stroke-width="0.5" stroke-opacity="0.5" />
                `);
            }
            return lineElements;
        }
        renderGrid(axisLengths = { x: 10, y: 10 }) {
            const { x, y } = axisLengths;
            return svg `
                ${this.renderXAxisLines(x)}
                ${this.renderYAxisLines(y)}
            `;
        }
    }
    return LitGridClass;
};
//# sourceMappingURL=lit-grid.js.map