import { assert, fixture } from '@open-wc/testing';
import { html, LitElement } from 'lit';
import { AXIS_TYPE } from '../../constants';
import { LitAxisMixin } from '../../mixins/lit-axis';
import * as Expected from './lit-axis_test.expect';

class Numbers extends LitAxisMixin(LitElement) {
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
customElements.define('test-numbers', Numbers);

class Dates extends LitAxisMixin(LitElement) {
    override render () {
        const begin = Number(new Date('2023-01-01T12:00:00'));
        const end = Number(new Date('2023-01-07T12:00:00'));
        const axis = {
            begin,
            end,
            interval: (end - begin) / 7,
            type: AXIS_TYPE.DATE
        };
        const payload = {
            y: axis,
            x: axis
        };
        return html `
            <svg 
                height=300 
                width=300 
                viewBox="-5 0 100 105">
                         ${this.renderAxis(payload)}
            </svg>
        `
    }
}
customElements.define('test-dates', Dates);

function stripHtmlComments(content) {
    return content.replace(/<!--(?!>)[\S\s]*?-->/g, '');
}

suite('lit-axis mixin', ()=> {
    test('is defined', () => {
        const el = document.createElement('test-numbers');
        assert.instanceOf(el, Numbers);
        assert.exists((el as Numbers).renderAxis);
    });

    test('renders with default values (numbers)', async () => {
        const el = await fixture(html`<test-numbers></test-numbers>`);
        const innerHtml = stripHtmlComments(el.shadowRoot?.innerHTML);
        if (innerHtml) {
            assert.equal(innerHtml, Expected.defaults, 'Expected render with no arguments to return default values');
        } else {
            assert.fail('Component shadowroot did not contain any inner HTML');
        }
    });

    test('renders with dates', async () => {
        const el = await fixture(html`<test-dates></test-dates>`);
        const innerHtml = stripHtmlComments(el.shadowRoot?.innerHTML);
        if (innerHtml) {
            assert.equal(innerHtml, Expected.defaults, 'Expected render with dates to display date measurement labels');
        } else {
            assert.fail('Component shadowroot did not contain any inner HTML');
        }
    });
});