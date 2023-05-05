import {assert, fixture} from '@open-wc/testing';
import {html, LitElement} from 'lit';
import {LitGridMixin} from '../../mixins/lit-grid';

class TestEl extends LitGridMixin(LitElement) {
    override render() {
        return html`<svg>${this.renderGrid()}</svg>`;
    }
}
customElements.define('test-el', TestEl);

class TestEl2 extends LitGridMixin(LitElement) {
    override render() {
        return html`<svg>${this.renderGrid({x: 3, y: 3})}</svg>`;
    }
}
customElements.define('test-el-two', TestEl2);

suite('lit-grid mixin', () => {
    test('is defined', () => {
        const el = document.createElement('test-el');
        assert.instanceOf(el, TestEl);
        assert.exists((el as TestEl).renderGrid);
    });

    test('renders with default values', async () => {
        const el = await fixture(html`<test-el></test-el>`);
        assert.shadowDom.equal(
            el,
            `<svg>
                <line y1="0" y2="100" stroke="gray" stroke-width="0.5" 
                    stroke-opacity="0.5" x1="10" x2="10"></line>
                <line y1="0" y2="100" stroke="gray" stroke-width="0.5" 
                    stroke-opacity="0.5" x1="20" x2="20"></line>
                <line y1="0" y2="100" stroke="gray" stroke-width="0.5" 
                    stroke-opacity="0.5" x1="30" x2="30"></line>
                <line y1="0" y2="100" stroke="gray" stroke-width="0.5" 
                    stroke-opacity="0.5" x1="40" x2="40"></line>
                <line y1="0" y2="100" stroke="gray" stroke-width="0.5" 
                    stroke-opacity="0.5" x1="50" x2="50"></line>
                <line y1="0" y2="100" stroke="gray" stroke-width="0.5" 
                    stroke-opacity="0.5" x1="60" x2="60"></line>
                <line y1="0" y2="100" stroke="gray" stroke-width="0.5" 
                    stroke-opacity="0.5" x1="70" x2="70"></line>
                <line y1="0" y2="100" stroke="gray" stroke-width="0.5" 
                    stroke-opacity="0.5" x1="80" x2="80"></line>
                <line y1="0" y2="100" stroke="gray" stroke-width="0.5" 
                    stroke-opacity="0.5" x1="90" x2="90"></line>
                <line x1="0" x2="100" stroke="gray" stroke-width="0.5" 
                    stroke-opacity="0.5" y1="10" y2="10"></line>
                <line x1="0" x2="100" stroke="gray" stroke-width="0.5" 
                    stroke-opacity="0.5" y1="20" y2="20"></line>
                <line x1="0" x2="100" stroke="gray" stroke-width="0.5" 
                    stroke-opacity="0.5" y1="30" y2="30"></line>
                <line x1="0" x2="100" stroke="gray" stroke-width="0.5" 
                    stroke-opacity="0.5" y1="40" y2="40"></line>
                <line x1="0" x2="100" stroke="gray" stroke-width="0.5" 
                    stroke-opacity="0.5" y1="50" y2="50"></line>
                <line x1="0" x2="100" stroke="gray" stroke-width="0.5" 
                    stroke-opacity="0.5" y1="60" y2="60"></line>
                <line x1="0" x2="100" stroke="gray" stroke-width="0.5" 
                    stroke-opacity="0.5" y1="70" y2="70"></line>
                <line x1="0" x2="100" stroke="gray" stroke-width="0.5" 
                    stroke-opacity="0.5" y1="80" y2="80"></line>
                <line x1="0" x2="100" stroke="gray" stroke-width="0.5" 
                    stroke-opacity="0.5" y1="90" y2="90"></line>
            <!---->
        </svg>`
        );
    });

    test('renders with custom values', async () => {
        const el = await fixture(html`<test-el-two></test-el-two>`);
        assert.shadowDom.equal(el, `<svg></svg>`);
    });
});
