import assert from 'assert';

import { formatTimeUTC } from '../../src/util/vcard.util.js';

describe('Format time to UTC', () => {
  it('should return the time in UTC format', () => {
    const now = new Date('2023-05-30T12:34:56Z');

    const result = formatTimeUTC(now);

    assert.strictEqual(result, '20230530T123456Z');
  });
});
