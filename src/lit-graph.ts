import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { LitGridMixin } from'./mixins/lit-grid';
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
  @property()
  declare name: string;

  /**
   * The Y axis label
   */
  @property({type: Number})
  declare count: number;

  constructor() {
    super();
    this.name = "World";
    this.count = 0;
  }

  /**
   * The X axis label
   */
  @property({ attribute: 'x-label'})
  xLabel = 'x Axis Label';


  override render() {
    return html`
      <svg viewBox="0 0 150 150">
        ${this.renderGrid()}
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-graph': LitGraph;
  }
}