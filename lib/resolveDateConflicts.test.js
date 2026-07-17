const assert = require('node:assert');
const { resolveDateConflicts } = require('./resolveDateConflicts.js');

// Normal case: single unique date -> confidence = average weight
assert.deepStrictEqual(
  resolveDateConflicts([{ date: '2023-01-15', weight: 1 }]),
  { finalDate: '2023-01-15', confidence: 1, conflicts: [] }
);

// Normal case: multiple same dates -> confidence = average weight
assert.deepStrictEqual(
  resolveDateConflicts([
    { date: '2023-06-10', weight: 2 },
    { date: '2023-06-10', weight: 3 }
  ]),
  { finalDate: '2023-06-10', confidence: 2.5, conflicts: [] }
);

// Edge case: null input
assert.deepStrictEqual(
  resolveDateConflicts(null),
  { finalDate: null, confidence: 0, conflicts: [] }
);

// Edge case: empty array
assert.deepStrictEqual(
  resolveDateConflicts([]),
  { finalDate: null, confidence: 0, conflicts: [] }
);

// Edge case: all invalid dates -> treated as null
assert.deepStrictEqual(
  resolveDateConflicts([{ date: 'invalid', weight: 1 }, { date: null, weight: 2 }]),
  { finalDate: null, confidence: 0, conflicts: [] }
);

// Edge case: dates with year difference > 5 -> discard
const result = resolveDateConflicts([
  { date: '2010-01-01', weight: 1 },
  { date: '2016-06-15', weight: 1 }
]);
assert.strictEqual(result.finalDate, null);
assert.strictEqual(result.confidence, 0);
assert.deepStrictEqual(result.conflicts, ['2010-01-01', '2016-06-15']);

// Edge case: conflict within 5 years -> WEIGHTED average per spec.
// years:  (1*2020 + 3*2022)/4 = 2021.5 -> 2022
// months: (1*0    + 3*5)/4    = 3.75   -> 4 (May)
// days:   (1*1    + 3*15)/4   = 11.5   -> 12
// confidence = totalWeight/count = 4/2 = 2
const result2 = resolveDateConflicts([
  { date: '2020-01-01', weight: 1 },
  { date: '2022-06-15', weight: 3 }
]);
assert.strictEqual(result2.finalDate, '2022-05-12');
assert.strictEqual(result2.confidence, 2);
assert.deepStrictEqual(result2.conflicts, ['2020-01-01', '2022-06-15']);

// Edge case: undefined date -> treated as null
assert.deepStrictEqual(
  resolveDateConflicts([{ date: undefined, weight: 1 }]),
  { finalDate: null, confidence: 0, conflicts: [] }
);

console.log('ok');