var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ref, createRef } from 'lit/directives/ref.js';
import { AXIS, AXIS_LABEL_LIMIT, AXIS_TYPE } from './constants';
import { LitAxisMixin } from './mixins/lit-axis';
import { LitGridMixin } from './mixins/lit-grid';
import { LitLabelMixin } from './mixins/lit-label';
import { LitLinePlotMixin } from './mixins/lit-line-plot';
function isValidDate(dateStr) {
    const date = Date.parse(dateStr);
    return !isNaN(date);
}
const defaultSingleAxisData = { begin: 0, end: 0, interval: 0 };
const Mixin = LitAxisMixin(LitGridMixin(LitLabelMixin(LitLinePlotMixin(LitElement))));
/**
 * Lit Graph Component.
 *
 * @data - The data that needs to be graphed. Can take in strings, numbers, or dates
 * @x-label - Main label for the X axis
 * @y-label - Main label for the Y axis
 */
let LitGraph = class LitGraph extends Mixin {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor() {
        super();
        this.svg = createRef();
        this.fillGraphMeta = (axisData, point, _, data) => {
            this.checkDataIntegrity(point, data);
            axisData.x = this.fillAxisMeta(axisData.x, point.x);
            axisData.y = this.fillAxisMeta(axisData.y, point.y);
            return axisData;
        };
        this.xLabel = '';
        this.yLabel = '';
        this.data = null;
    }
    getAxisType(singleAxisPoint) {
        if (typeof singleAxisPoint === 'string') {
            if (isValidDate(singleAxisPoint)) {
                return AXIS_TYPE.DATE;
            }
            else {
                return AXIS_TYPE.STRING;
            }
        }
        else if (typeof singleAxisPoint === 'number') {
            return AXIS_TYPE.NUMBER;
        }
        throw new Error(`Point ${JSON.stringify(singleAxisPoint)} has a bad data type`);
    }
    checkDataIntegrity({ x: currX, y: currY }, data) {
        const { x: firstX, y: firstY } = data[0];
        const currXType = this.getAxisType(currX);
        const currYType = this.getAxisType(currY);
        const firstXType = this.getAxisType(firstX);
        const firstYType = this.getAxisType(firstY);
        if (currXType !== firstXType || currYType !== firstYType) {
            throw new Error('Data contains mismatching types');
        }
    }
    getSingleAxisDataStruct(axisType) {
        switch (axisType) {
            case AXIS_TYPE.DATE:
                return {
                    ...defaultSingleAxisData,
                    type: AXIS_TYPE.DATE,
                };
            case AXIS_TYPE.STRING:
                return [];
            case AXIS_TYPE.NUMBER:
                return {
                    ...defaultSingleAxisData,
                    type: AXIS_TYPE.NUMBER,
                };
            default:
                throw new Error(`AxisType ${axisType} is not a valid AxisType`);
        }
    }
    fillAxisMeta(data, axisPnt) {
        if (typeof axisPnt === 'string') {
            if (Array.isArray(data)) {
                data.push(axisPnt);
            }
            else if (!Array.isArray(data) && data.type === AXIS_TYPE.DATE) {
                const date = Date.parse(axisPnt);
                data.begin =
                    data.begin === 0 || data.begin > date ? date : data.begin;
                data.end = data.end === 0 || data.end < date ? date : data.end;
                data.interval = Math.ceil((data.end - data.begin) / AXIS_LABEL_LIMIT[AXIS_TYPE.DATE]);
            }
        }
        else if (typeof axisPnt === 'number' && !Array.isArray(data)) {
            data.begin =
                data.begin === 0 || data.begin > axisPnt ? axisPnt : data.begin;
            data.end =
                data.end === 0 || data.end < axisPnt ? axisPnt : data.end;
            data.interval = Math.ceil((data.end - data.begin) / AXIS_LABEL_LIMIT[AXIS_TYPE.NUMBER]);
        }
        return data;
    }
    getGraphMeta(data) {
        const axisTypes = {
            [AXIS.X]: this.getAxisType(data[0].x),
            [AXIS.Y]: this.getAxisType(data[0].y),
        };
        const graphMeta = {
            x: this.getSingleAxisDataStruct(axisTypes[AXIS.X]),
            y: this.getSingleAxisDataStruct(axisTypes[AXIS.Y]),
        };
        return data.reduce(this.fillGraphMeta, graphMeta);
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        const svg = this.svg.value;
        if (svg) {
            const box = svg.getBBox();
            const xS = (box && box.x) || 0;
            const yS = (box && box.y) || 0;
            const xE = (box && box.width) || 100;
            const yE = (box && box.height) || 100;
            svg.setAttribute('viewBox', `${xS} ${yS} ${xE} ${yE}`);
        }
    }
    render() {
        if (!this.data) {
            throw new Error('No data was passed to Lit-Graph');
        }
        const graphMeta = this.getGraphMeta(this.data);
        return html `
            <svg viewBox="0 0 150 150" ${ref(this.svg)}>
                ${this.renderGrid()} ${this.renderAxis(graphMeta)}
                ${this.renderLabels({ x: this.xLabel, y: this.yLabel }, { x: this.xEdge, y: this.yEdge })}
                ${this.renderLinePlot(this.data, graphMeta)}
            </svg>
        `;
    }
};
LitGraph.styles = [
    Mixin.styles || [],
    css `
            svg {
                height: var(--svg-height, 300px);
                width: var(--svg-width, 300px)
            }
    `
];
__decorate([
    property({ attribute: 'x-label' })
], LitGraph.prototype, "xLabel", void 0);
__decorate([
    property({ attribute: 'y-label' })
], LitGraph.prototype, "yLabel", void 0);
__decorate([
    property({ type: Array, attribute: 'data' })
], LitGraph.prototype, "data", void 0);
LitGraph = __decorate([
    customElement('lit-graph')
], LitGraph);
export default LitGraph;
//# sourceMappingURL=lit-graph.js.map