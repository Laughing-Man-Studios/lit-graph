import { assert, fixture } from '@open-wc/testing';
import { html, LitElement } from 'lit';
import { state } from 'lit/decorators.js';
import { AXIS_TYPE, GRAPH } from '../../constants';
import { LitAxisMixin } from '../../mixins/lit-axis';
import { AxisData } from '../../types';
import * as Expected from './lit-axis_test.expect';
import { ref, createRef } from 'lit/directives/ref.js';

class Numbers extends LitAxisMixin(LitElement) {
    override render () {
        return html `
            <svg 
                height=300 
                width=300 
                viewBox="-5 0 150 155">
                    ${this.renderAxis()}
            </svg>
        `
    }
}
customElements.define('test-numbers', Numbers);

class Dates extends LitAxisMixin(LitElement) {

    @state()
    protected graph = { ...GRAPH };

    @state()
    protected viewBox = { ...GRAPH }

    private svg = createRef<SVGSVGElement>();

    override updated() {
        const svg = this.svg.value;
        if (svg) {
            const box = svg.getBBox();
            const xS = box && box.x || 0;
            const yS = box && box.y || 0;
            const xE = box && box.width || 100;
            const yE = box && box.height || 100;

            svg.setAttribute('viewBox', `${xS} ${yS} ${xE} ${yE}`)
        }
    }

    override render() {
        const begin = Number(new Date('2023-01-01T12:00:00'));
        const end = Number(new Date('2023-01-07T12:00:00'));
        const axis = {
            begin,
            end,
            interval: (end - begin) / 10,
            type: AXIS_TYPE.DATE
        } as AxisData<AXIS_TYPE.DATE>;
        const payload = {
            y: axis,
            x: axis
        };

        return html `
            <svg 
                ${ref(this.svg)}
                height=300 
                width=300>
                         ${this.renderAxis(payload)}
            </svg>
        `
    }
}
customElements.define('test-dates', Dates);

function stripHtmlComments(content: string | undefined): string {
    if (content) {
        return content.replace(/<!--(?!>)[\S\s]*?-->/g, '');
    }

    return '';
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
            assert.equal(innerHtml, Expected.dates, 'Expected render with dates to display date measurement labels');
        } else {
            assert.fail('Component shadowroot did not contain any inner HTML');
        }
    });
});