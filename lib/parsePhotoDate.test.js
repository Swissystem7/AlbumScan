'use strict';
const assert = require('node:assert');
const { parsePhotoDate } = require('./parsePhotoDate.js');
assert.deepStrictEqual(parsePhotoDate('IMG_20230715_142530.jpg'), { year: 2023, month: 7, day: 15 });
assert.deepStrictEqual(parsePhotoDate('PXL_20230715_142530123.jpg'), { year: 2023, month: 7, day: 15 });
assert.strictEqual(parsePhotoDate('noDateHere.jpg'), null);
assert.strictEqual(parsePhotoDate('IMG_20231315.jpg'), null); // month 13
assert.strictEqual(parsePhotoDate('IMG_20230732.jpg'), null); // day 32
assert.strictEqual(parsePhotoDate('short_1234567.jpg'), null); // only 7 digits
console.log('ok');
