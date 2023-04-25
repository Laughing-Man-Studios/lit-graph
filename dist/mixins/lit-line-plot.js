import { css, svg } from 'lit';
import { AXIS, GRAPH } from '../constants';
export const LitLinePlotMixin = (superClass) => {
    class LitLinePlotClass extends superClass {
        generateStringAxisPosition(plot, data, axis) {
            const { START, END } = GRAPH[axis];
            const plotIndex = data.indexOf(plot);
            if (plotIndex < 0) {
                throw new Error('String Plot doesnt exist in axis data');
            }
            return (END - START) * (plotIndex / data.length);
        }
        generateNumAxisPosition(plot, data, axis) {
            const { START, END } = GRAPH[axis];
            const position = (END - START) * (plot - data.begin) / (data.end - data.begin);
            if (axis === AXIS.Y) {
                return END - position;
            }
            return position;
        }
        getAxisPosition(plot, data, axis) {
            if (Array.isArray(data)) {
                if (typeof plot === 'string') {
                    return this.generateStringAxisPosition(plot, data, axis);
                }
                throw new Error('Axis Data is of type string but plot is Number');
            }
            if (typeof plot !== 'number') {
                throw new Error('Axis Data is of type number but plot is String');
            }
            return this.generateNumAxisPosition(plot, data, axis);
        }
        getElements(data, axisData) {
            const renderElements = { circles: [], lines: [] };
            let prev = null;
            for (let i = 0; i < data.length; i++) {
                const current = data[i];
                const x = this.getAxisPosition(current.x, axisData.x, AXIS.X);
                const y = this.getAxisPosition(current.y, axisData.y, AXIS.Y);
                renderElements.circles.push(svg `<circle cx="${x}" cy="${y}" />`);
                if (prev) {
                    renderElements.lines.push(svg `
                            <line x1="${prev.x}" y1="${prev.y}" x2="${x}" y2="${y}" />
                        `);
                }
                prev = { x, y };
            }
            return renderElements;
        }
        renderLinePlot(data, axisData) {
            const { circles, lines } = this.getElements(data, axisData);
            return (svg `
                <g id="PlotCircles">
                    ${circles}
                </g>
                <g id="PlotLines">
                    ${lines}
                </g>
            `);
        }
    }
    LitLinePlotClass.styles = (css `
            #PlotCircles circle {
                r: 1.5;
            }

            #PlotLines line {
                stroke: black;
            }
        `);
    return LitLinePlotClass;
};
//# sourceMappingURL=lit-line-plot.js.map