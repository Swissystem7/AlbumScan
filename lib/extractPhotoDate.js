const fs = require('fs');
const path = require('path');

function extractPhotoDate(filePath) {
  if (!filePath || typeof filePath !== 'string') return null;
  const basename = path.basename(filePath, path.extname(filePath));
  const patterns = [
    /(\d{4})([-_]?)(0[1-9]|1[0-2])\2(0[1-9]|[12]\d|3[01])/,
    /(\d{4})(\d{2})(\d{2})_?(\d{2})?(\d{2})?(\d{2})?/
  ];
  for (const pattern of patterns) {
    const match = basename.match(pattern);
    if (match) {
      let year, month, day;
      if (pattern === patterns[0]) {
        year = parseInt(match[1], 10);
        month = parseInt(match[3], 10);
        day = parseInt(match[4], 10);
      } else {
        year = parseInt(match[1], 10);
        month = parseInt(match[2], 10);
        day = parseInt(match[3], 10);
      }
      if (month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(year, month)) {
        return formatDate(year, month, day);
      }
    }
  }
  try {
    const stats = fs.statSync(filePath);
    const mtime = stats.mtime;
    if (mtime.getTime() === new Date(1970, 0, 1).getTime()) return null;
    const year = mtime.getFullYear();
    const month = mtime.getMonth() + 1;
    const day = mtime.getDate();
    return formatDate(year, month, day);
  } catch {
    return null;
  }
}

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function formatDate(year, month, day) {
  const y = year.toString().padStart(4, '0');
  const m = month.toString().padStart(2, '0');
  const d = day.toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

module.exports = { extractPhotoDate };