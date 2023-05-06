import LitGraph from '../lit-graph';

import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import { TemplateResult } from 'lit';

const ERRORS = {
    NO_DATA: 'No data was passed to Lit-Graph',
    BAD_DATA: 'Point {} has a bad data type',
    MISMATCH_DATA: 'Data contains mismatching types',
    BAD_ARGS: 'AxisType something is not a valid AxisType'
};

const TEST_DATA = {
    NUMBERS: [
        {x: 1, y: 1},
        {x : 2, y: 2},
    ],
    DATES: [
        { x: '2023-05-05T12:02:27.034Z', y: '2023-05-05T12:02:27.034Z' },
        { x: '2023-06-05T12:02:27.034Z', y: '2023-06-05T12:02:27.034Z' },
        { x: '2023-07-05T12:02:27.034Z', y: '2023-07-05T12:02:27.034Z' }
    ],
    STRING: [
        { x: 'ONE', y: 1 },
        { x: 'TWO', y: 2 },
        { x: 'THREE', y: 3 },
    ],
    BAD: [
        { x: {}, y: {} },
        { x: {}, y: {} },
        { x: {}, y: {} },
    ],
    MISMATCH: [
        { x: 1, y: 1 },
        { x: 'two', y: 'two' }
    ]
};

async function assertError(promise: Promise<Element>, error: string) {
    try {
        await promise;
    } catch (e) {
        if (e instanceof Error) {
            const failMessage = `Wrong Error was thrown: ${e.message}`;
            return assert.equal(e.message, error, failMessage);
        } else {
            return assert.fail('Did not catch an error in catch block');
        }
    }
    return assert.fail('Did not throw an error');
}

async function assertRender(renderHTML: TemplateResult) {
    const el = (await fixture(renderHTML)) as LitGraph;
    const labels = el.renderRoot.querySelector('#labels');
    const xGridLines = el.renderRoot.querySelector('#xGridLines');
    const yGridLines = el.renderRoot.querySelector('#yGridLines');
    const xLabels = el.renderRoot.querySelector('#xLabels');
    const yLabels = el.renderRoot.querySelector('#yLabels');
    const plotCircles = el.renderRoot.querySelector('#PlotCircles');
    const plotLines = el.renderRoot.querySelector('#PlotLines');

    assert.exists(labels, 'Couldnt find labels grouping');
    assert.exists(xGridLines, 'Couldnt find X Grid Lines grouping');
    assert.exists(yGridLines, 'Couldnt find Y Grid Lines grouping');
    assert.exists(xLabels, 'Couldnt find X Labels grouping');
    assert.exists(yLabels, 'Couldnt find Y Labels grouping');
    assert.exists(plotCircles, 'Couldnt find Plot Circles grouping');
    assert.exists(plotLines, 'Couldnt find Plot Lines grouping');
}

suite('lit-graph', () => {
    test('is defined', () => {
        const el = document.createElement('lit-graph');
        assert.instanceOf(el, LitGraph);
        assert.exists(el.renderAxis, 'Couldnt find renderAxis mixin method');
        assert.exists(el.renderGrid, 'Couldnt find renderGrid mixin method');
        assert.exists(
            el.renderLabels,
            'Couldnt find renderLabels mixin method'
        );
        assert.exists(
            el.renderLinePlot,
            'Couldnt find renderLinePlot mixin method'
        );
    });

    test('throws correct error when no properties are passed', async () =>{
        const promise = fixture(html`<lit-graph></lit-graph>`);
        return await assertError(promise, ERRORS.NO_DATA);
    });

    test('calls all mixin render functions with numbers as data', async () => {
        const renderHTML = html`
            <lit-graph
                x-label="Test"
                y-label="Test"
                .data="${TEST_DATA.NUMBERS}"
            ></lit-graph>
        `;

        assertRender(renderHTML);
    });

    test('calls all mixin render functions with dates as data', async () => {
        const renderHTML = html`
            <lit-graph
                x-label="Test"
                y-label="Test"
                .data="${TEST_DATA.DATES}"
            ></lit-graph>
        `;

        assertRender(renderHTML);
    });

    test('calls all mixin render functions with strings as data', async () => {
        const renderHTML = html`
            <lit-graph
                x-label="Test"
                y-label="Test"
                .data="${TEST_DATA.STRING}"
            ></lit-graph>
        `;

        assertRender(renderHTML);
    });

    
    test('throws correct error when bad data is passed', async () => {
        const renderHTML = html`
             <!-- @ts-ignore -->
            <lit-graph
                x-label="Test"
                y-label="Test"
                .data="${TEST_DATA.BAD}"
            ></lit-graph>
        `;
        const promise = fixture(renderHTML);
        
        return await assertError(promise, ERRORS.BAD_DATA);
    });

    test('throws correct error when mismatched data is passed', async () => {
        const renderHTML = html`
        
            <lit-graph
                x-label="Test"
                y-label="Test"
                .data="${TEST_DATA.MISMATCH}"
            ></lit-graph>
        `;
        const promise = fixture(renderHTML);
        
        return await assertError(promise, ERRORS.MISMATCH_DATA);
    });

    test('throws correct error when getSingleAxisDataStruct is called with bad args', async () => {
        const renderHTML = html`
            <lit-graph
                x-label="Test"
                y-label="Test"
                .data="${TEST_DATA.STRING}"
            ></lit-graph>
        `;
        const el: LitGraph = await fixture(renderHTML);
        const promise = new Promise<Element>(() => { 
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            el['getSingleAxisDataStruct']('something'); return el; 
        });
        
        return await assertError(promise, ERRORS.BAD_ARGS);
    });
});
