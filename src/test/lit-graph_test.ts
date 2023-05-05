import LitGraph from '../lit-graph';

import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

const ERRORS = {
  NO_DATA: 'No data was passed to Lit-Graph'
};

suite('my-element', () => {
  test('is defined', () => {
    const el = document.createElement('lit-graph');
    assert.instanceOf(el, LitGraph);
  });

  test('throws error when no properties are passed', async () => {
    try {
      await fixture(html`<lit-graph></lit-graph>`);
    } catch(e) {
      if (e instanceof Error) {
        return assert.equal(e.message, ERRORS.NO_DATA, `Wrong Error was thrown: ${e.message}`);
      } else {
        return assert.fail('Did not catch an error in catch block');
      }
    }
    return assert.fail('Did not throw an error');
  });

  test('styling applied', async () => {
    const el = (await fixture(html`<lit-graph></lit-graph>`)) as LitGraph;
    await el.updateComplete;
    assert.equal(getComputedStyle(el).paddingTop, '16px');
  });
});