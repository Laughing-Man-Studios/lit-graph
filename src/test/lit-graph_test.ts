import LitGraph from '../lit-graph';

import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import { TemplateResult } from 'lit';

const ERRORS = {
    NO_DATA: 'No data was passed to Lit-Graph',
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
    ]
};

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

    test('throws error when no properties are passed', async () => {
        try {
            await fixture(html`<lit-graph></lit-graph>`);
        } catch (e) {
            if (e instanceof Error) {
                const failMessage = `Wrong Error was thrown: ${e.message}`;
                return assert.equal(e.message, ERRORS.NO_DATA, failMessage);
            } else {
                return assert.fail('Did not catch an error in catch block');
            }
        }
        return assert.fail('Did not throw an error');
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
});
