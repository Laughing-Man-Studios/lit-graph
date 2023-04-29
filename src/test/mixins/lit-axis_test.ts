import { assert, fixture } from '@open-wc/testing';
import { html, LitElement } from 'lit';
import { timeout } from '../helpers';
import { AXIS_TYPE } from '../../constants';
import { LitAxisMixin } from '../../mixins/lit-axis';
import { AxisMeta } from '../../types';
import { ref, createRef } from 'lit/directives/ref.js';

const expects = {
    default: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    dates: [
        ['1/1/2023', '12:00:00'],
        ['1/2/2023', '02:24:00'],
        ['1/2/2023', '16:48:00'],
        ['1/3/2023', '07:12:00'],
        ['1/3/2023', '21:36:00'],
        ['1/4/2023', '12:00:00'],
        ['1/5/2023', '02:24:00'],
        ['1/5/2023', '16:48:00'],
        ['1/6/2023', '07:12:00'],
        ['1/6/2023', '21:36:00'],
        ['1/7/2023', '12:00:00'],
    ]
};

function testDefaultLabels(label: Element, index: number) {
    assert.equal(Number(label.textContent), expects.default[index], 'Label text wrong');
}

function testDateLabels(label: Element, index: number) {
    const tspans = label.querySelectorAll('tspan');
    assert.equal(tspans.length, 2, 'Inner TSpans did not render');
    assert.equal(tspans[0]?.textContent?.trim(), expects.dates[index][0], '1st TSpan text wrong');
    assert.equal(tspans[1]?.textContent?.trim(), expects.dates[index][1], '2nd TSpan text wrong');
}

class Numbers extends LitAxisMixin(LitElement) {
    override render () {
        return (html `
            <svg 
                height=300 
                width=300 
                viewBox="-5 0 150 155">
                    ${this.renderAxis()}
            </svg>
        `);
    }
}
customElements.define('test-numbers', Numbers);

class Dates extends LitAxisMixin(LitElement) {

    private svg = createRef<SVGSVGElement>();

    override updated() {
        const svg = this.svg.value;
        if (svg) {
            const box = svg.getBBox();
            const xS = box && box.x || 0;
            const yS = box && box.y || 0;
            const xE = box && box.width || 100;
            const yE = box && box.height || 100;

            svg.setAttribute('viewBox', `${xS} ${yS} ${xE} ${yE}`);
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
        } as AxisMeta<AXIS_TYPE.DATE>;
        const payload = {
            y: axis,
            x: axis
        };

        return (html `
            <svg 
                ${ref(this.svg)}
                height=300 
                width=300>
                         ${this.renderAxis(payload)}
            </svg>
        `);
    }
}
customElements.define('test-dates', Dates);

suite('lit-axis mixin', ()=> {
    test('is defined', () => {
        const el = document.createElement('test-numbers');
        assert.instanceOf(el, Numbers);
        assert.exists((el as Numbers).renderAxis);
    });

    test('renders with default values (numbers)', async () => {
        const el: LitElement = await fixture(html`<test-numbers></test-numbers>`);
        await timeout(500);
        const xLabels = el.renderRoot.querySelectorAll('#xLabels text');
        const yLabels = el.renderRoot.querySelectorAll('#yLabels text');
        if (el) {
            assert.lengthOf(xLabels, 10, 'Expected number of x labels to equal 10');
            assert.lengthOf(yLabels, 10, 'Expected number of y labels to equal 10');
            
            xLabels.forEach(testDefaultLabels);

            yLabels.forEach(testDefaultLabels);

        } else {
            assert.fail('Component did not render');
        }
    });

    test('renders with dates', async () => {
        const el:LitElement = await fixture(html`<test-dates></test-dates>`);
        const xLabels = el.renderRoot.querySelectorAll('#xLabels text');
        const yLabels = el.renderRoot.querySelectorAll('#yLabels text');
        if (el) {


            assert.lengthOf(xLabels, 11, 'Number of X Labels is wrong');
            assert.lengthOf(yLabels, 11, 'Number of Y Labels is wrong');

            xLabels.forEach(testDateLabels);

            yLabels.forEach(testDateLabels);
        } else {
            assert.fail('Component did not render');
        }
    });
});