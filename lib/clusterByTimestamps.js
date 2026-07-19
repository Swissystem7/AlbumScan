function clusterByTimestamps(photos, maxGapMinutes = 120) {
  if (!Array.isArray(photos)) throw new TypeError('photos must be an array');
  if (!Number.isFinite(maxGapMinutes) || maxGapMinutes < 0) throw new Error('Invalid maxGapMinutes');
  if (photos.length === 0) return [];
  const sorted = photos.map(p => {
    const d = new Date(p.timestamp);
    if (isNaN(d.getTime())) throw new Error(`Invalid timestamp: ${p.timestamp}`);
    return { id: p.id, time: d.getTime() };
  }).sort((a, b) => a.time - b.time);
  const maxGapMs = maxGapMinutes * 60 * 1000;
  const clusters = [];
  let current = [sorted[0].id];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].time - sorted[i-1].time <= maxGapMs) {
      current.push(sorted[i].id);
    } else {
      clusters.push(current);
      current = [sorted[i].id];
    }
  }
  clusters.push(current);
  return clusters;
}
module.exports = { clusterByTimestamps };
