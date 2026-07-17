const assert = require('node:assert');
const { findDuplicateGroups } = require('./findDuplicateGroups.js');

// Raw 8x8 grayscale image (one byte per pixel), fn(x,y) -> 0..255.
function grayBuf(fn) {
  const b = Buffer.alloc(64);
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 8; x++)
      b[y * 8 + x] = fn(x, y);
  return b;
}
// Two visibly different patterns -> aHashes ~32 bits apart (well over default cutoff of 6).
const patA = grayBuf((x) => (x >= 4 ? 255 : 0)); // left/right split
const patB = grayBuf((_x, y) => (y >= 4 ? 255 : 0)); // top/bottom split

// Normal case: identical images -> one group
const r1 = findDuplicateGroups([
  { id: 'a', imageBuffer: grayBuf((x) => (x >= 4 ? 255 : 0)) },
  { id: 'b', imageBuffer: grayBuf((x) => (x >= 4 ? 255 : 0)) },
]);
assert.deepStrictEqual(r1, [['a', 'b']], 'identical images should form a group');

// Normal case: clearly different images -> no group (default threshold 0.9)
const r2 = findDuplicateGroups([
  { id: 'c', imageBuffer: patA },
  { id: 'd', imageBuffer: patB },
]);
assert.deepStrictEqual(r2, [], 'very different images should not form a group');

// Edge: empty array
assert.deepStrictEqual(findDuplicateGroups([]), [], 'empty array -> []');

// Edge: single photo
assert.deepStrictEqual(
  findDuplicateGroups([{ id: 'e', imageBuffer: patA }]),
  [],
  'single photo -> []'
);

// Edge: threshold < 0 -> clamp to 0 (match everything)
const r5 = findDuplicateGroups([
  { id: 'f', imageBuffer: patA },
  { id: 'g', imageBuffer: patA },
], -0.5);
assert.deepStrictEqual(r5, [['f', 'g']], 'negative threshold clamps to 0');

// Edge: threshold > 1 -> clamp to 1 (only exact hash matches)
const r6 = findDuplicateGroups([
  { id: 'h', imageBuffer: patA },
  { id: 'i', imageBuffer: patB },
], 1.5);
assert.deepStrictEqual(r6, [], 'threshold > 1 clamps to 1, distinct images do not match');

// Edge: threshold = 1 -> only identical hashes group
const r7 = findDuplicateGroups([
  { id: 'j', imageBuffer: patA },
  { id: 'k', imageBuffer: grayBuf((x) => (x >= 4 ? 255 : 0)) }, // == patA
  { id: 'l', imageBuffer: patB },
], 1);
assert.deepStrictEqual(r7, [['j', 'k']], 'threshold=1 groups only identical images');

// Edge: threshold = 0 -> group everything
const r8 = findDuplicateGroups([
  { id: 'm', imageBuffer: patA },
  { id: 'n', imageBuffer: patB },
], 0);
assert.strictEqual(r8.length, 1, 'threshold=0 groups all images');
assert.strictEqual(r8[0].length, 2, 'threshold=0 group holds both images');

console.log('ok');
