import assert from 'assert';

import { getCurrentTime } from '../../src/util/vcard.util.js';

describe('getCurrentTime', () => {
  it('should return the current time in UTC format', () => {
    // Mock the current date and time to a fixed value
    const now = new Date('2023-05-30T12:34:56Z');
    global.Date = class extends Date {
      constructor() {
        super();
        return now;
      }
    };

    // Call the getCurrentTime function
    const result = getCurrentTime();

    // Check if the result matches the expected UTC format
    assert.strictEqual(result, '20230530T123456Z');
  });
});
