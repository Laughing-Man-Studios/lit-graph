import { assert, fixture } from '@open-wc/testing';
import { html, LitElement } from 'lit';
import { LitAxisMixin } from '../../mixins/lit-axis';
import * as Expected from './lit-axis_test.expect';

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
customElements.define('test-el', TestEl);

function stripHtmlComments(content) {
    return content.replace(/<!--(?!>)[\S\s]*?-->/g, '');
}

suite('lit-axis mixin', ()=> {
    test('is defined', () => {
        const el = document.createElement('test-el');
        assert.instanceOf(el, TestEl);
        assert.exists((el as TestEl).renderAxis);
    });

    test('renders with default values (numbers)', async () => {
        const el = await fixture(html`<test-el></test-el>`);
        const innerHtml = stripHtmlComments(el.shadowRoot?.innerHTML);
        if (innerHtml) {
            assert.equal(innerHtml, Expected.defaults, 'Expected render with no arguments to return default values');
        } else {
            assert.fail('Component shadowroot did not contain any inner HTML');
        }
    });
});