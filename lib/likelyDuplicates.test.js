'use strict';
const assert = require('node:assert');
const { likelyDuplicates } = require('./likelyDuplicates.js');
assert.strictEqual(likelyDuplicates({ name: 'IMG_1234_a.jpg', sizeBytes: 1000 }, { name: 'img_1234_b.jpg', sizeBytes: 1010 }), true); // 1% diff, same prefix ci
assert.strictEqual(likelyDuplicates({ name: 'IMG_1234_a.jpg', sizeBytes: 1000 }, { name: 'IMG_1234_b.jpg', sizeBytes: 1030 }), false); // 3% diff
assert.strictEqual(likelyDuplicates({ name: 'AAAA0000.jpg', sizeBytes: 500 }, { name: 'BBBB1111.jpg', sizeBytes: 500 }), false); // diff prefix
assert.strictEqual(likelyDuplicates(null, { name: 'x', sizeBytes: 1 }), false);
console.log('ok');
