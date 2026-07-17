function resolveDateConflicts(dateSources) {
  if (!dateSources || dateSources.length === 0) {
    return { finalDate: null, confidence: 0, conflicts: [] };
  }
  const valid = dateSources.filter(ds => {
    if (ds.date === null || ds.date === undefined) return false;
    return !isNaN(new Date(ds.date).getTime());
  });
  if (valid.length === 0) {
    return { finalDate: null, confidence: 0, conflicts: [] };
  }
  const uniqueDates = [...new Set(valid.map(v => v.date))];
  if (uniqueDates.length === 1) {
    const avgWeight = valid.reduce((sum, v) => sum + v.weight, 0) / valid.length;
    return { finalDate: uniqueDates[0], confidence: avgWeight, conflicts: [] };
  }
  const conflicts = valid.map(v => v.date);
  // ponytail: use UTC getters/Date.UTC throughout so output is timezone-independent
  const dates = valid.map(v => new Date(v.date));
  const years = dates.map(d => d.getUTCFullYear());
  const months = dates.map(d => d.getUTCMonth());
  const days = dates.map(d => d.getUTCDate());
  if (Math.max(...years) - Math.min(...years) > 5) {
    return { finalDate: null, confidence: 0, conflicts };
  }
  const totalWeight = valid.reduce((sum, v) => sum + v.weight, 0);
  const avgYear = Math.round(valid.reduce((sum, v, i) => sum + v.weight * years[i], 0) / totalWeight);
  const avgMonth = Math.round(valid.reduce((sum, v, i) => sum + v.weight * months[i], 0) / totalWeight);
  const avgDay = Math.round(valid.reduce((sum, v, i) => sum + v.weight * days[i], 0) / totalWeight);
  const finalDate = new Date(Date.UTC(avgYear, avgMonth, avgDay));
  const finalDateStr = finalDate.toISOString().split('T')[0];
  const avgConfidence = totalWeight / valid.length;
  return { finalDate: finalDateStr, confidence: avgConfidence, conflicts };
}
module.exports = { resolveDateConflicts };