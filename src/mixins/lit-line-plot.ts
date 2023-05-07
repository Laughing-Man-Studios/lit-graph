import {css, LitElement, svg, TemplateResult} from 'lit';
import {AXIS, AXIS_TYPE, GRAPH} from '../constants';
import {PlotData, AxisType, GraphMeta, AxisMeta, NUM_AXIS_TYPE} from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = {}> = new (...args: any[]) => T;
type RenderElements = {
    circles: Array<TemplateResult>;
    lines: Array<TemplateResult>;
};

export declare class LitLinePlotInterface {
    renderLinePlot(data: PlotData, axisData: GraphMeta): unknown;
}

export const LitLinePlotMixin = <T extends Constructor<LitElement>>(
    superClass: T
) => {
    class LitLinePlotClass extends superClass {
        static styles = [
            (superClass as unknown as typeof LitElement).styles ?? [],
            css`
                #PlotCircles circle {
                    r: 1.5;
                }

                #PlotLines line {
                    stroke: black;
                }
            `,
        ];

        private generateStringAxisPosition(
            plot: string,
            data: AxisMeta<AXIS_TYPE.STRING>,
            axis: AXIS
        ): number {
            const {START, END} = GRAPH[axis];

            const plotIndex = data.indexOf(plot);

            if (plotIndex < 0) {
                throw new Error('String Plot doesnt exist in axis data');
            }

            return (END - START) * (plotIndex / data.length);
        }

        private generateNumAxisPosition(
            plot: number,
            data: AxisMeta<NUM_AXIS_TYPE>,
            axis: AXIS
        ): number {
            const {START, END} = GRAPH[axis];
            const position =
                ((END - START) * (plot - data.begin)) / (data.end - data.begin);

            if (axis === AXIS.Y) {
                return END - position;
            }

            return position;
        }

        private getAxisPosition(
            plot: AxisType,
            data: AxisMeta<AXIS_TYPE>,
            axis: AXIS
        ): number {
            let massagedPlot = plot;
            if (Array.isArray(data)) {
                if (typeof massagedPlot === 'string') {
                    return this.generateStringAxisPosition(
                        massagedPlot,
                        data,
                        axis
                    );
                }
                throw new Error(
                    'Axis Data is of type string but plot is Number'
                );
            } else if (data.type === AXIS_TYPE.DATE) {
                if (typeof massagedPlot === 'string') {
                    massagedPlot = Date.parse(massagedPlot);
                } else {
                    throw new Error(
                        'Axis Data is of type date but plot is Number'
                    );
                }
            } else if (
                data.type === AXIS_TYPE.NUMBER &&
                typeof massagedPlot !== 'number'
            ) {
                throw new Error(
                    'Axis Data is of type number but plot is String'
                );
            }

            return this.generateNumAxisPosition(
                massagedPlot as number,
                data,
                axis
            );
        }

        private getElements(
            data: PlotData,
            axisData: GraphMeta
        ): RenderElements {
            const renderElements: RenderElements = {circles: [], lines: []};
            let prev: {x: number; y: number} | null = null;

            for (let i = 0; i < data.length; i++) {
                const current = data[i];
                const x = this.getAxisPosition(current.x, axisData.x, AXIS.X);
                const y = this.getAxisPosition(current.y, axisData.y, AXIS.Y);

                renderElements.circles.push(
                    svg`<circle cx="${x}" cy="${y}" />`
                );

                if (prev) {
                    renderElements.lines.push(svg`
                            <line x1="${prev.x}" y1="${prev.y}" x2="${x}" y2="${y}" />
                        `);
                }

                prev = {x, y};
            }

            return renderElements;
        }

        renderLinePlot(data: PlotData, axisData: GraphMeta) {
            const {circles, lines} = this.getElements(data, axisData);

            return svg`
                <g id="PlotCircles">
                    ${circles}
                </g>
                <g id="PlotLines">
                    ${lines}
                </g>
            `;
        }
    }

    return LitLinePlotClass as Constructor<LitLinePlotInterface> & T;
};
