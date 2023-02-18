import { LitElement, svg } from 'lit';
import { Axis, AxisData } from '../types';
import { GRAPH } from '../constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = {}> = new (...args: any[]) => T;

export declare class LitAxisInterface {
    renderAxis(axisData?: Axis<number>): unknown;
}

const CONSTANTS = {
    MEASUREMENT_OFFSET: -1,
    SPACING_OFFSET: 5,
    FONT_SIZE: 6
};

const defaults = {
    x: { begin: 0, end: 9, interval: 1, type: 'number' },
    y: { begin: 0, end: 9, interval: 1, type: 'number'}
} as Axis<AxisData>;

export const LitAxisMixin = <T extends Constructor<LitElement>>(superClass: T) => {
    class LitAxisClass extends superClass {
        private renderXAxis(xData: AxisData) {
            const { X_START, X_END, Y_END } = GRAPH;
            const { MEASUREMENT_OFFSET, SPACING_OFFSET, FONT_SIZE } = CONSTANTS;
            const lineElements = [svg`<line 
                x1="${X_START}" 
                y1="${Y_END}" 
                x2="${X_END}" 
                y2="${Y_END}"
                stoke-width="0.5"
                stroke="black">`];
            if (Array.isArray(xData)) {
                const spacing = X_END / xData.length;
                for (let i = xData.length; i > 0; i -= 1) {
                    lineElements.push(svg`
                        <text 
                            x="${i*spacing-MEASUREMENT_OFFSET}" 
                            y="${Y_END + SPACING_OFFSET}" 
                            font-size="${FONT_SIZE}px">
                                ${xData[i]}
                        </text>
                    `)
                }
            } else {
                const spacing = (X_END - FONT_SIZE) / ((xData.end - xData.begin) / xData.interval);
                for (let i = xData.begin; i < xData.end + 1; i += xData.interval) {
                    const renderString = xData.type === 'number' ? i : new Date(i);
                    lineElements.push(svg`
                        <text 
                            x="${i*spacing+MEASUREMENT_OFFSET}" 
                            y="${Y_END + SPACING_OFFSET}" 
                            font-size="6px">
                                ${renderString}
                        </text>
                    `)
                }                
            }                        
                
            return lineElements;
        }

        private renderYAxis(yData: AxisData) {
            const { X_START, Y_START, Y_END } = GRAPH;
            const { FONT_SIZE, SPACING_OFFSET } = CONSTANTS;
            const lineElements = [svg`<line 
                x1="${X_START}"
                y1="${Y_START}"
                x2="${X_START}"
                y2="${Y_END}"
                stoke-width="0.5" 
                stroke="black">`];
            if (Array.isArray(yData)) {
                for (let i = yData.length; i > 0; i -= 1) {
                    lineElements.push(svg`
                        <text y="${i*10-5}" x="-5" font-size="6px">${yData[i]}</text>
                    `)
                }
            } else {
                const spacing = (Y_END - FONT_SIZE) / ((yData.end - yData.begin) / yData.interval);
                for (let i = yData.end; i > yData.begin - 1; i -= yData.interval) {
                    const renderString = yData.type === 'number' ? i : new Date(i);
                    lineElements.push(svg`
                        <text 
                            y="${Y_END-i*spacing}" 
                            x="-${SPACING_OFFSET}" 
                            font-size="${FONT_SIZE}px">
                                ${renderString}
                        </text>
                    `)
                }                
            }        

            return lineElements;
        }

        renderAxis(axisData: Axis<AxisData> = defaults) {
            const { x, y } = axisData;

            return svg`
                ${this.renderXAxis(x)}
                ${this.renderYAxis(y)}
            `
        }
    }
    return LitAxisClass as Constructor<LitAxisInterface> & T;
}