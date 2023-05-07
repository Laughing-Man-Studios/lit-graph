import { LitElement, PropertyValues } from 'lit';
import { PlotData } from './types';
declare const Mixin: (new (...args: any[]) => import("./mixins/lit-axis").LitAxisInterface) & (new (...args: any[]) => import("./mixins/lit-grid").LitGridInterface) & (new (...args: any[]) => import("./mixins/lit-label").LitLabelInterface) & (new (...args: any[]) => import("./mixins/lit-line-plot").LitLinePlotInterface) & typeof LitElement;
/**
 * Lit Graph Component.
 *
 * @data - The data that needs to be graphed. Can take in strings, numbers, or dates
 * @x-label - Main label for the X axis
 * @y-label - Main label for the Y axis
 * @csspart button - The button
 */
export default class LitGraph extends Mixin {
    /**
     * The X axis label
     */
    xLabel: string;
    /**
     * The X axis label
     */
    yLabel: string;
    /**
     * Data in JSON array format [{ x: <val>, y:<val> }, ...]
     */
    data: PlotData | null;
    private svg;
    constructor();
    private getAxisType;
    private checkDataIntegrity;
    private getSingleAxisDataStruct;
    private fillAxisMeta;
    private fillGraphMeta;
    private getGraphMeta;
    updated(changedProperties: PropertyValues): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'lit-graph': LitGraph;
    }
}
export {};
//# sourceMappingURL=lit-graph.d.ts.map