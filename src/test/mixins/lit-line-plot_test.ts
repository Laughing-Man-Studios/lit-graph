import {assert, fixture} from '@open-wc/testing';
import {LitLinePlotMixin} from '../../mixins/lit-line-plot';
import {html, LitElement} from 'lit';
import {AxisData} from '../../types';
import {AXIS_TYPE} from '../../constants';

class Numbers extends LitLinePlotMixin(LitElement) {
    private plot = [
        {x: 0, y: 0},
        {x: 1, y: 1},
        {x: 2, y: 2},
        {x: 3, y: 3},
        {x: 4, y: 4},
        {x: 5, y: 5},
        {x: 6, y: 6},
        {x: 7, y: 7},
        {x: 8, y: 8},
        {x: 9, y: 9},
    ];

    private axisData = {
        x: {begin: 0, end: 9, interval: 1, type: 'number'},
        y: {begin: 0, end: 9, interval: 1, type: 'number'},
    } as AxisData<AXIS_TYPE.NUMBER, AXIS_TYPE.NUMBER>;

    override render() {
        return html`
            <svg height="300px" width="300px" viewBox="0 0 150 150">
                ${this.renderLinePlot(this.plot, this.axisData)}
            </svg>
        `;
    }
}
customElements.define('test-numbers', Numbers);

class Dates extends LitLinePlotMixin(LitElement) {
    private plot = [
        {x: 1618162213000, y: 1618162213000},
        {x: 1649698213000, y: 1649698213000},
        {x: 1681234213000, y: 1681234213000},
    ];
    private interval = (this.plot[0].x - this.plot[2].x) / 5;
    private axisData = {
        x: {
            begin: 1618162213000,
            end: 1681234213000,
            interval: this.interval,
            type: 'date',
        },
        y: {
            begin: 1618162213000,
            end: 1681234213000,
            interval: this.interval,
            type: 'date',
        },
    } as AxisData<AXIS_TYPE.DATE, AXIS_TYPE.DATE>;

    override render() {
        return html`
            <svg height="300px" width="300px" viewBox="0 0 150 150">
                ${this.renderLinePlot(this.plot, this.axisData)}
            </svg>
        `;
    }
}
customElements.define('test-dates', Dates);

suite('lit-line-plot mixin', () => {
    test('is defined', () => {
        const el = document.createElement('test-numbers');
        assert.instanceOf(el, Numbers);
        assert.exists((el as Numbers).renderLinePlot);
    });

    test('renders with numbers', async () => {
        const el: LitElement = await fixture(
            html`<test-numbers></test-numbers>`
        );
        const plotPoints = el.renderRoot.querySelectorAll('circle');
        const plotLines = el.renderRoot.querySelectorAll('line');

        assert.lengthOf(
            plotPoints,
            10,
            'Expected number of plot points to equal 10'
        );
        assert.lengthOf(
            plotLines,
            9,
            'Expected number of line points to equal 9'
        );
    });

    test('renders with dates', async () => {
        const el: LitElement = await fixture(html`<test-dates></test-dates>`);
        const plotPoints = el.renderRoot.querySelectorAll('circle');
        const plotLines = el.renderRoot.querySelectorAll('line');

        assert.lengthOf(
            plotPoints,
            3,
            'Expected number of plot points to equal 3'
        );
        assert.lengthOf(
            plotLines,
            2,
            'Expected number of line points to equal 2'
        );
    });
});
