import {LitElement, html, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {ref, createRef} from 'lit/directives/ref.js';
import {AXIS, AXIS_LABEL_LIMIT, AXIS_TYPE} from './constants';
import {LitAxisMixin} from './mixins/lit-axis';
import {LitGridMixin} from './mixins/lit-grid';
import {LitLabelMixin} from './mixins/lit-label';
import {LitLinePlotMixin} from './mixins/lit-line-plot';
import {Axis, GraphMeta, AxisType, PlotData, AxisMeta} from './types';

function isValidDate(dateStr: string) {
    const date = Date.parse(dateStr);
    return !isNaN(date);
}
const defaultSingleAxisData = {begin: 0, end: 0, interval: 0};
const Mixin = LitAxisMixin(
    LitGridMixin(LitLabelMixin(LitLinePlotMixin(LitElement)))
);
type PlotPnt = Axis<AxisType, AxisType>;

/**
 * Lit Graph Component.
 *
 * @data - The data that needs to be graphed. Can take in strings, numbers, or dates
 * @x-label - Main label for the X axis
 * @y-label - Main label for the Y axis
 * @csspart button - The button
 */
@customElement('lit-graph')
export default class LitGraph extends Mixin {
    /**
     * The X axis label
     */
    @property({attribute: 'x-label'})
    declare xLabel;

    /**
     * The X axis label
     */
    @property({attribute: 'y-label'})
    declare yLabel;
    /**
     * Data in JSON array format [{ x: <val>, y:<val> }, ...]
     */
    @property({type: Array, attribute: 'data'})
    declare data: PlotData | null;

    private svg = createRef<SVGSVGElement>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor() {
        super();
        this.xLabel = '';
        this.yLabel = '';
        this.data = null;
    }

    private getAxisType(singleAxisPoint: AxisType): AXIS_TYPE {
        if (typeof singleAxisPoint === 'string') {
            if (isValidDate(singleAxisPoint)) {
                return AXIS_TYPE.DATE;
            } else {
                return AXIS_TYPE.STRING;
            }
        } else if (typeof singleAxisPoint === 'number') {
            return AXIS_TYPE.NUMBER;
        }
        throw new Error(
            `Point ${JSON.stringify(singleAxisPoint)} has a bad data type`
        );
    }

    private checkDataIntegrity(
        {x: currX, y: currY}: PlotPnt,
        data: PlotData
    ): void {
        const {x: firstX, y: firstY} = data[0];
        const currXType = this.getAxisType(currX);
        const currYType = this.getAxisType(currY);
        const firstXType = this.getAxisType(firstX);
        const firstYType = this.getAxisType(firstY);

        if (currXType !== firstXType || currYType !== firstYType) {
            throw new Error('Data contains mismatching types');
        }
    }

    private getSingleAxisDataStruct(axisType: AXIS_TYPE): AxisMeta<AXIS_TYPE> {
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

    private fillAxisMeta(
        data: AxisMeta<AXIS_TYPE>,
        axisPnt: AxisType
    ): AxisMeta<AXIS_TYPE> {
        if (typeof axisPnt === 'string') {
            if (Array.isArray(data)) {
                data.push(axisPnt);
            } else if (!Array.isArray(data) && data.type === AXIS_TYPE.DATE) {
                const date = Date.parse(axisPnt);

                data.begin =
                    data.begin === 0 || data.begin > date ? date : data.begin;
                data.end = data.end === 0 || data.end < date ? date : data.end;
                data.interval = Math.ceil(
                    (data.end - data.begin) / AXIS_LABEL_LIMIT[AXIS_TYPE.DATE]
                );
            }
        } else if (typeof axisPnt === 'number' && !Array.isArray(data)) {
            data.begin =
                data.begin === 0 || data.begin > axisPnt ? axisPnt : data.begin;
            data.end =
                data.end === 0 || data.end < axisPnt ? axisPnt : data.end;
            data.interval = Math.ceil(
                (data.end - data.begin) / AXIS_LABEL_LIMIT[AXIS_TYPE.NUMBER]
            );
        }

        return data;
    }

    private fillGraphMeta = (
        axisData: GraphMeta,
        point: PlotPnt,
        _: number,
        data: PlotData
    ) => {
        this.checkDataIntegrity(point, data);
        axisData.x = this.fillAxisMeta(axisData.x, point.x);
        axisData.y = this.fillAxisMeta(axisData.y, point.y);

        return axisData;
    };

    private getGraphMeta(data: PlotData): GraphMeta {
        const axisTypes: Axis<AXIS_TYPE, AXIS_TYPE> = {
            [AXIS.X]: this.getAxisType(data[0].x),
            [AXIS.Y]: this.getAxisType(data[0].y),
        };

        const graphMeta = {
            x: this.getSingleAxisDataStruct(axisTypes[AXIS.X]),
            y: this.getSingleAxisDataStruct(axisTypes[AXIS.Y]),
        };

        return data.reduce(this.fillGraphMeta, graphMeta);
    }

    override updated(changedProperties: PropertyValues): void {
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

    override render() {
        if (!this.data) {
            throw new Error('No data was passed to Lit-Graph');
        }
        const graphMeta = this.getGraphMeta(this.data);

        return html`
            <svg viewBox="0 0 150 150" ${ref(this.svg)}>
                ${this.renderGrid()} ${this.renderAxis(graphMeta)}
                ${this.renderLabels(
                    {x: this.xLabel, y: this.yLabel},
                    {x: this.xEdge, y: this.yEdge}
                )}
                ${this.renderLinePlot(this.data, graphMeta)}
            </svg>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'lit-graph': LitGraph;
    }
}
