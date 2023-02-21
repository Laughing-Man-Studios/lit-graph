import { LitElement, svg, TemplateResult } from 'lit';
import { Axis, AxisData } from '../types';
import { AXIS, AXIS_TYPE, GRAPH } from '../constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = {}> = new (...args: any[]) => T;

export declare class LitAxisInterface {
    renderAxis(axisData?: Axis<AxisData<AXIS_TYPE>>): unknown;
}

const CONSTANTS = {
    MEASUREMENT_OFFSET: -1,
    SPACING_OFFSET: 5,
    FONT_SIZE: 6
};

const defaults = {
    x: { begin: 0, end: 9, interval: 1, type: 'number' },
    y: { begin: 0, end: 9, interval: 1, type: 'number'}
} as Axis<AxisData<AXIS_TYPE.NUMBER>>;

type GeneratorArgs<T extends AXIS_TYPE> = {
    axis: AXIS,
    lineElements: Array<TemplateResult>,
    data: T extends AXIS_TYPE.STRING ? Array<String> : AxisData<T>
};
type DateNum = AXIS_TYPE.DATE | AXIS_TYPE.NUMBER;

export const LitAxisMixin = <T extends Constructor<LitElement>>(superClass: T) => {
    class LitAxisClass extends superClass {
        private generateLine(axis: AXIS, lineElements: Array<TemplateResult>): void {
            const { X_START, X_END, Y_START, Y_END } = GRAPH;
            lineElements.push(svg`
                <line
                    x1="${X_START}" 
                    y1="${axis === AXIS.X ? Y_END : Y_START}" 
                    x2="${axis === AXIS.X ? X_END : X_START}" 
                    y2="${Y_END}"
                    stoke-width="0.5"
                    stroke="black"
                >
            `)
        }
        private generateStrLabels({ axis, lineElements, data }: GeneratorArgs<AXIS_TYPE.STRING>): void {
            const { X_END, Y_END } = GRAPH;
            const { MEASUREMENT_OFFSET, SPACING_OFFSET, FONT_SIZE } = CONSTANTS;
            const spacing = (axis === AXIS.X ? X_END : Y_END) / data.length;
            for (let i = data.length; i > 0; i -= 1) {
                const x = axis === AXIS.X ? i*spacing-MEASUREMENT_OFFSET : -SPACING_OFFSET;
                const y = axis === AXIS.X ? Y_END + SPACING_OFFSET : i*spacing-MEASUREMENT_OFFSET;
                lineElements.push(svg`
                    <text 
                        x="${x}" 
                        y="${y}" 
                        font-size="${FONT_SIZE}px">
                            ${data[i]}
                    </text>
                `)
            }
        }
        private generateDateNumLabels<T extends DateNum>(args: GeneratorArgs<T>) {
                const { axis, lineElements, data } = args;
                const { X_END, Y_END } = GRAPH;
                const { FONT_SIZE, MEASUREMENT_OFFSET, SPACING_OFFSET } = CONSTANTS;
                const spacing = ((axis === AXIS.X) ? X_END : Y_END - FONT_SIZE) 
                    / ((data.end - data.begin) / data.interval);
                let j = 0;
                
                for (let i = data.begin; i < data.end + 1; i += data.interval) {
                    const x = axis === AXIS.X ? j*spacing+MEASUREMENT_OFFSET : -SPACING_OFFSET;
                    const y = axis === AXIS.X ? Y_END + SPACING_OFFSET : Y_END-j*spacing
                    lineElements.push(svg`
                        <text 
                            x="${x}" 
                            y="${y}" 
                            font-size="${FONT_SIZE}px">
                                ${data.type === AXIS_TYPE.DATE ? new Date(i) : i}
                        </text>
                    `)
                    j++;
            }
        }
        private renderSingleAxis(data: AxisData<AXIS_TYPE>, axis: AXIS) {
            const lineElements: Array<TemplateResult> = [];
            this.generateLine(axis, lineElements);
            if (Array.isArray(data)) {
                this.generateStrLabels({ axis, lineElements, data});
            } else {
                this.generateDateNumLabels<typeof data.type>({ axis, lineElements, data});
            }
                
            return lineElements;
        }

        renderAxis(axisData: Axis<AxisData<AXIS_TYPE>> = defaults) {
            const { x, y } = axisData;

            return svg`
                ${this.renderSingleAxis(x, AXIS.X)}
                ${this.renderSingleAxis(y, AXIS.Y)}
            `
        }
    }
    return LitAxisClass as Constructor<LitAxisInterface> & T;
}