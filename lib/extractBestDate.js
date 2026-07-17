function extractBestDate(photo) {
  const { id, imageBuffer, exifDate } = photo;
  let date = null;
  let confidence = 0;

  if (exifDate) {
    const parsed = parseExifDate(exifDate);
    if (parsed) {
      date = parsed;
      confidence = 0.95;
    }
  }

  if (!date) {
    const ocrResult = runOcr(imageBuffer);
    if (ocrResult.length > 0) {
      const dateCounts = {};
      let maxCount = 0;
      let bestDate = null;
      for (const d of ocrResult) {
        dateCounts[d] = (dateCounts[d] || 0) + 1;
        if (dateCounts[d] > maxCount) {
          maxCount = dateCounts[d];
          bestDate = d;
        }
      }
      if (bestDate) {
        date = bestDate;
        confidence = maxCount / ocrResult.length * 0.8;
      }
    }
  }

  return { id, date, confidence };
}

function parseExifDate(str) {
  if (!str || str === '0000' || str === '0000:00:00' || str === '0000-00-00') return null;
  const cleaned = str.replace(/[^0-9]/g, '');
  if (cleaned.length < 8) return null;
  const year = cleaned.substring(0, 4);
  const month = cleaned.substring(4, 6);
  const day = cleaned.substring(6, 8);
  if (year === '0000' || month === '00' || day === '00') return null;
  const y = parseInt(year, 10);
  const m = parseInt(month, 10);
  const d = parseInt(day, 10);
  if (y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  return `${year}-${month}-${day}`;
}

function runOcr(buffer) {
  const text = buffer.toString('utf8');
  const datePattern = /\b(\d{4})[-\/](\d{2})[-\/](\d{2})\b/g;
  const dates = [];
  let match;
  while ((match = datePattern.exec(text)) !== null) {
    const year = match[1];
    const month = match[2];
    const day = match[3];
    if (year !== '0000' && month !== '00' && day !== '00') {
      const y = parseInt(year, 10);
      const m = parseInt(month, 10);
      const d = parseInt(day, 10);
      if (y >= 1900 && y <= 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        dates.push(`${year}-${month}-${day}`);
      }
    }
  }
  return dates;
}

module.exports = { extractBestDate };