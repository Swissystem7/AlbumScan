'use strict';
const assert = require('node:assert');
const { groupByMonth } = require('./groupByMonth.js');

// Normal: counts per month, multiple months.
assert.deepStrictEqual(
  groupByMonth([
    { dateIso: '2023-01-05' },
    { dateIso: '2023-01-20' },
    { dateIso: '2023-02-01' },
  ]),
  { '2023-01': 2, '2023-02': 1 }
);

// Edge: non-array -> {}
assert.deepStrictEqual(groupByMonth(null), {});
assert.deepStrictEqual(groupByMonth(undefined), {});
assert.deepStrictEqual(groupByMonth('nope'), {});
assert.deepStrictEqual(groupByMonth(42), {});

// Edge: empty array -> {}
assert.deepStrictEqual(groupByMonth([]), {});

// Edge: missing / non-string dateIso ignored
assert.deepStrictEqual(
  groupByMonth([{}, { dateIso: 123 }, { dateIso: null }, null, undefined, { dateIso: '2024-06-10' }]),
  { '2024-06': 1 }
);

// Edge: malformed format ignored (not YYYY-MM-DD)
assert.deepStrictEqual(
  groupByMonth([
    { dateIso: '2024-6-10' },
    { dateIso: '20240610' },
    { dateIso: '2024/06/10' },
    { dateIso: '2024-06-10T00:00:00Z' },
    { dateIso: '' },
    { dateIso: '2024-06-10' },
  ]),
  { '2024-06': 1 }
);

// Edge: impossible calendar dates ignored
assert.deepStrictEqual(
  groupByMonth([
    { dateIso: '2023-02-30' },
    { dateIso: '2023-13-01' },
    { dateIso: '2023-00-10' },
    { dateIso: '2023-04-31' },
    { dateIso: '2024-02-29' }, // leap day is valid
  ]),
  { '2024-02': 1 }
);

console.log('ok');