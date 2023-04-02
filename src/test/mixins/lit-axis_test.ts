import { assert, fixture } from '@open-wc/testing';
import { html, LitElement } from 'lit';
import { state } from 'lit/decorators.js';
import { AXIS_TYPE, GRAPH } from '../../constants';
import { LitAxisMixin } from '../../mixins/lit-axis';
import { AxisData } from '../../types';
import { ref, createRef } from 'lit/directives/ref.js';

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

    @state()
    protected graph = { ...GRAPH };

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
        } as AxisData<AXIS_TYPE.DATE>;
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

const expects = {
    default: {
        x: [-1,13,28,43,58,73,88,103,118,133],
        y: [150,135,120,105,90,75,60,45,30,15]
    },
    dates: {
        x: [-7.6,7.6,23,38,54,70,85.2,100.4,115.6,130.6,145.6],
        y: [150,136.3,122.7,109.9,95.4,81.8,68.1,54.4,40.9,27.2,13.6]
    },
    errorOffset: 1.5
};

suite('lit-axis mixin', ()=> {
    test('is defined', () => {
        const el = document.createElement('test-numbers');
        assert.instanceOf(el, Numbers);
        assert.exists((el as Numbers).renderAxis);
    });

    test('renders with default values (numbers)', async () => {
        const el: LitElement = await fixture(html`<test-numbers></test-numbers>`);
        const xLabels = el.renderRoot.querySelectorAll('#xLabels text');
        const yLabels = el.renderRoot.querySelectorAll('#yLabels text');
        if (el) {
            assert.lengthOf(xLabels, 10, 'Expected number of x labels to equal 10');
            assert.lengthOf(yLabels, 10, 'Expected number of y labels to equal 10');
            
            xLabels.forEach((label, index) => {
                assert.isBelow(Number(label.getAttribute('x')), expects.default.x[index]+1);
                assert.isAbove(Number(label.getAttribute('x')), expects.default.x[index]-1);
            });

            yLabels.forEach((label, index) => {
                assert.isBelow(Number(label.getAttribute('y')), expects.default.y[index]+1);
                assert.isAbove(Number(label.getAttribute('y')), expects.default.y[index]-1);
            });

        } else {
            assert.fail('Component did not render');
        }
    });

    test('renders with dates', async () => {
        const xLabelYVal = 155;
        const yLabelXVal = -31.4;
        const { dates, errorOffset } = expects;
        const { userAgent: UA } = navigator;
        const isWebkit = UA.includes('Safari') && UA.includes('Version');
        const offset = isWebkit ? errorOffset + 6 : errorOffset;
        const el:LitElement = await fixture(html`<test-dates></test-dates>`);
        const xLabels = el.renderRoot.querySelectorAll('#xLabels text');
        const yLabels = el.renderRoot.querySelectorAll('#yLabels text');
        if (el) {
            assert.lengthOf(xLabels, 11, 'Number of X Labels is wrong');
            assert.lengthOf(yLabels, 11, 'Number of Y Labels is wrong');

            xLabels.forEach((label, index) => {
                const xVal = Number(label.getAttribute('x'));
                const yVal = Number(label.getAttribute('y'));

                assert.isBelow(yVal, xLabelYVal + offset);
                assert.isAbove(yVal, xLabelYVal - offset);

                assert.isBelow(xVal, dates.x[index] + offset);
                assert.isAbove(xVal, dates.x[index] - offset);
            });

            yLabels.forEach((label, index) => {
                const xVal = Number(label.getAttribute('x'));
                const yVal = Number(label.getAttribute('y'));

                assert.isBelow(xVal, yLabelXVal + offset);
                assert.isAbove(xVal, yLabelXVal - offset);
                

                assert.isBelow(yVal, dates.y[index] + offset);
                assert.isAbove(yVal, dates.y[index] - offset);
            });
        } else {
            assert.fail('Component did not render');
        }
    });
});