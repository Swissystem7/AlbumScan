'use strict';
// likelyDuplicates: same first 8 chars (case-insensitive) AND sizes within 2% of the larger.
function likelyDuplicates(a, b) {
  if (!a || !b) return false;
  const na = String(a.name).slice(0, 8).toLowerCase();
  const nb = String(b.name).slice(0, 8).toLowerCase();
  if (na !== nb) return false;
  const sa = Number(a.sizeBytes), sb = Number(b.sizeBytes);
  const larger = Math.max(sa, sb);
  if (larger <= 0) return true; // both zero-size + same prefix
  return Math.abs(sa - sb) / larger < 0.02;
}
module.exports = { likelyDuplicates };
