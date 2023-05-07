import {assert, fixture} from '@open-wc/testing';
import {LitLinePlotMixin} from '../../mixins/lit-line-plot';
import {html, LitElement} from 'lit';
import {GraphMeta} from '../../types';
import {assertError} from '../helpers';

class Numbers extends LitLinePlotMixin(LitElement) {
    plot = [
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

    axisData = {
        x: {begin: 0, end: 9, interval: 1, type: 'number'},
        y: {begin: 0, end: 9, interval: 1, type: 'number'},
    } as GraphMeta;

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
        {x: '2021-04-11T17:30:13.000Z', y: '2021-04-11T17:30:13.000Z'},
        {x: '2022-04-11T17:30:13.000Z', y: '2022-04-11T17:30:13.000Z'},
        {x: '2023-04-11T17:30:13.000Z', y: '2023-04-11T17:30:13.000Z'},
    ];
    private interval =
        (Date.parse(this.plot[0].x) - Date.parse(this.plot[2].x)) / 5;
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
    } as GraphMeta;

    override render() {
        return html`
            <svg height="300px" width="300px" viewBox="0 0 150 150">
                ${this.renderLinePlot(this.plot, this.axisData)}
            </svg>
        `;
    }
}
customElements.define('test-dates', Dates);

class ErrorsString extends Numbers {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    override plot = [{x: 'asdf', y: 'asdf'}];
}

customElements.define('test-errors-string', ErrorsString);

class ErrorsNumbers extends Numbers {
    override axisData = {
        x: ['one', 'two', 'three'],
        y: ['one', 'two', 'three'],
    } as GraphMeta;
}

customElements.define('test-errors-numbers', ErrorsNumbers);

class ErrorsDates extends Numbers {
    override axisData = {
        x: {
            begin: 1618162213000,
            end: 1681234213000,
            interval: 3,
            type: 'date',
        },
        y: {
            begin: 1618162213000,
            end: 1681234213000,
            interval: 3,
            type: 'date',
        },
    } as GraphMeta;
}

customElements.define('test-errors-dates', ErrorsDates);

class ErrorsStringMismatch extends Numbers {
    override axisData = {
        x: ['one', 'two', 'three'],
        y: ['one', 'two', 'three'],
    } as GraphMeta;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    override plot = [
        {x: 'four', y: 'four'},
        {x: 'four', y: 'four'},
        {x: 'four', y: 'four'},
    ];
}

customElements.define('test-errors-string-mismatch', ErrorsStringMismatch);

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

    test('throws correct error when number meta and string plot data are passed', async () => {
        const promise = fixture(
            html`<test-errors-string></test-errors-string>`
        );

        return await assertError(
            promise,
            'Axis Data is of type number but plot is String'
        );
    });

    test('throws correct error when string meta and number plot data are passed', async () => {
        const promise = fixture(
            html`<test-errors-numbers></test-errors-numbers>`
        );

        return await assertError(
            promise,
            'Axis Data is of type string but plot is Number'
        );
    });

    test('throws correct error when date meta and number plot data are passed', async () => {
        const promise = fixture(html`<test-errors-dates></test-errors-dates>`);

        return await assertError(
            promise,
            'Axis Data is of type date but plot is Number'
        );
    });

    test('throws correct error when string meta and string plot data dont match', async () => {
        const promise = fixture(
            html`<test-errors-string-mismatch></test-errors-string-mismatch>`
        );

        return await assertError(
            promise,
            'String Plot doesnt exist in axis data'
        );
    });
});
