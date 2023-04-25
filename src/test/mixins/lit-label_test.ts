import { assert, fixture } from '@open-wc/testing';
import { html, LitElement } from 'lit';
import { LitLabelMixin } from '../../mixins/lit-label';

const axisLabels = {
    x: 'Test1',
    y: 'Test2'
};

class Labels extends LitLabelMixin(LitElement) {
    override render() {
        return (html`
            <svg
                height="300px"
                width="300px"
                viewbox="0 0 150 150">
                    ${this.renderLabels(axisLabels)}
            </svg>
        `);
    }
}

customElements.define('test-labels', Labels);

suite('lit-label mixin', () => {
    test('is defined', ()=> {
        const el = document.createElement('test-labels');
        assert.instanceOf(el, Labels);
        assert.exists((el as Labels).renderLabels);
    });

    test('renders with labels', async () => {
        const el: LitElement = await fixture(html`<test-labels></test-labels>`);
        const xLabel = el.renderRoot.querySelector('#labels .x');
        const yLabel = el.renderRoot.querySelector('#labels .y');

        assert.equal(xLabel?.textContent, axisLabels.x);
        assert.equal(yLabel?.textContent, axisLabels.y);
    });
});