const assert = require('node:assert');
const { extractBestDate } = require('./extractBestDate.js');

// Normal case: valid exifDate
const photo1 = { id: 1, imageBuffer: Buffer.from(''), exifDate: '2023:05:15' };
const result1 = extractBestDate(photo1);
assert.strictEqual(result1.id, 1);
assert.strictEqual(result1.date, '2023-05-15');
assert.strictEqual(result1.confidence, 0.95);

// Edge case: exifDate is null, OCR returns multiple dates
const photo2 = { id: 2, imageBuffer: Buffer.from('2023-05-15 2023-05-15 2024-01-01'), exifDate: null };
const result2 = extractBestDate(photo2);
assert.strictEqual(result2.id, 2);
assert.strictEqual(result2.date, '2023-05-15');
assert.strictEqual(result2.confidence, 2 / 3 * 0.8);

// Edge case: exifDate is invalid, OCR returns no dates
const photo3 = { id: 3, imageBuffer: Buffer.from('no dates here'), exifDate: '0000:00:00' };
const result3 = extractBestDate(photo3);
assert.strictEqual(result3.id, 3);
assert.strictEqual(result3.date, null);
assert.strictEqual(result3.confidence, 0);

// Edge case: exifDate is valid, OCR also has dates (exifDate should win)
const photo4 = { id: 4, imageBuffer: Buffer.from('2024-06-20'), exifDate: '2023:05:15' };
const result4 = extractBestDate(photo4);
assert.strictEqual(result4.id, 4);
assert.strictEqual(result4.date, '2023-05-15');
assert.strictEqual(result4.confidence, 0.95);

// Edge case: exifDate is empty string
const photo5 = { id: 5, imageBuffer: Buffer.from(''), exifDate: '' };
const result5 = extractBestDate(photo5);
assert.strictEqual(result5.id, 5);
assert.strictEqual(result5.date, null);
assert.strictEqual(result5.confidence, 0);

// Edge case: OCR with single date
const photo6 = { id: 6, imageBuffer: Buffer.from('2022-12-31'), exifDate: null };
const result6 = extractBestDate(photo6);
assert.strictEqual(result6.id, 6);
assert.strictEqual(result6.date, '2022-12-31');
assert.strictEqual(result6.confidence, 1 * 0.8);

// Edge case: OCR with invalid dates (year out of range)
const photo7 = { id: 7, imageBuffer: Buffer.from('1899-01-01 2101-01-01'), exifDate: null };
const result7 = extractBestDate(photo7);
assert.strictEqual(result7.id, 7);
assert.strictEqual(result7.date, null);
assert.strictEqual(result7.confidence, 0);

console.log('ok');