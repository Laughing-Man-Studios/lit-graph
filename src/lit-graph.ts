import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

type Data = [
  { x: String | Number | Date, y: String | Number | Date }
];

/**
 * Lit Graph Component.
 *
 * @data - The data that needs to be graphed. Can take in strings, numbers, or dates
 * @x-label - Main label for the X axis
 * @y-label - Main label for the Y axis
 * @csspart button - The button
 */
@customElement('lit-graph')
export class LitGraph extends LitElement {
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

  override render() {
    return html`
      <svg>
        <rect width="100%" height="100%" fill="red" />
        <circle cx="150" cy="100" r="80" fill="green" />
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-graph': LitGraph;
  }
}