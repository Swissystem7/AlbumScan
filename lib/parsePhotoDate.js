'use strict';
// parsePhotoDate: extract first 8-digit YYYYMMDD run from a filename.
// Returns {year,month,day} or null if none / month not 1-12 / day not 1-31.
function parsePhotoDate(filename) {
  const m = String(filename).match(/\d{8}/);
  if (!m) return null;
  const s = m[0];
  const year = Number(s.slice(0, 4));
  const month = Number(s.slice(4, 6));
  const day = Number(s.slice(6, 8));
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year, month, day };
}
module.exports = { parsePhotoDate };
