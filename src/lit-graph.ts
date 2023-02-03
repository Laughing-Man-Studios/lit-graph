import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { axisLengths, getAxisData } from './helpers/axis';
import { LitGridMixin } from'./mixins/lit-grid';
import { AxisLengths, Data } from './types';
import { xAxisWindowSize, yAxisWindowSize } from './constants';
/**
 * Lit Graph Component.
 *
 * @data - The data that needs to be graphed. Can take in strings, numbers, or dates
 * @x-label - Main label for the X axis
 * @y-label - Main label for the Y axis
 * @csspart button - The button
 */
@customElement('lit-graph')
export default class LitGraph extends LitGridMixin(LitElement) {
  static override styles = css`
    :host {
      height: 100%;
      width: 100%;
    }
  `;

  /**
   * The data to graph.
   */
  @property({ type: Array })
  data: Data = [{ x: 1, y: 1 }];

  /**
   * The Y axis label
   */
  @property({ attribute: 'y-label'})
  yLabel = 'Y Axis Label';

  /**
   * The X axis label
   */
  @property({ attribute: 'x-label'})
  xLabel = 'x Axis Label';

  private getAxisLengths(): AxisLengths {
    const yAxisData = getAxisData('y', this.data);
    const xAxisData = getAxisData('x', this.data);

    if (yAxisData === null || xAxisData === null) {
      throw new Error('Could not get the data set for 1 or more axis');
    }

    const x = axisLengths(xAxisData);
    const y = axisLengths(yAxisData);
    
    if (y === null || x === null) {
      throw new Error('Could not get the axis length for 1 or more axis');
    }

    return { x, y };
  }

  override render() {
    return html`
      <svg viewBox="0 0 ${xAxisWindowSize} ${yAxisWindowSize}">
        ${this.renderGrid(this.getAxisLengths())}
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-graph': LitGraph;
  }
}