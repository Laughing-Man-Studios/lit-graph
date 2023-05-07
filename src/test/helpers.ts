/* c8 ignore next 16 */
import {assert} from '@open-wc/testing';

export async function assertError(promise: Promise<Element>, error: string) {
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
