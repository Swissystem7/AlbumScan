'use strict';

// groupByMonth(photos): map 'YYYY-MM' -> count of photos in that month.
// Entries without a valid YYYY-MM-DD dateIso are ignored. Non-array -> {}.
function groupByMonth(photos) {
  if (!Array.isArray(photos)) return {};
  const out = {};
  for (const p of photos) {
    const d = p && p.dateIso;
    if (typeof d !== 'string') continue;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
    if (!m) continue;
    // Reject impossible calendar dates (e.g. 2023-02-30) via round-trip.
    const dt = new Date(d + 'T00:00:00Z');
    if (Number.isNaN(dt.getTime()) || dt.toISOString().slice(0, 10) !== d) continue;
    const key = m[1] + '-' + m[2];
    out[key] = (out[key] || 0) + 1;
  }
  return out;
}

module.exports = { groupByMonth };