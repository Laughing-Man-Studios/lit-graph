import { assert, fixture } from '@open-wc/testing';
import { html, LitElement } from 'lit';
import { LitAxisMixin } from '../../mixins/lit-axis';

class TestEl extends LitAxisMixin(LitElement) {
    override render () {
        return html `
            <svg 
                height=300 
                width=300 
                viewBox="-5 0 100 105">
                    ${this.renderAxis()}
            </svg>
        `
    }
}
customElements.define('test-el', TestEl)

suite('lit-axis mixin', ()=> {
    test('is defined', () => {
        const el = document.createElement('test-el');
        assert.instanceOf(el, TestEl);
        assert.exists((el as TestEl).renderAxis);
    });

    test('renders with default values', async () => {
        const el = await fixture(html`<test-el></test-el>`);
        assert.shadowDom.equal(
            el,
            `<svg>
                <line x1="0" y1="0" x2="100" y2="0" stoke-width="0.5" stroke="black">
                <line x1="0" y1="0" x2="0" y2="100" stoke-width="0.5" stroke="black">
            </svg>`
        )
    });
});