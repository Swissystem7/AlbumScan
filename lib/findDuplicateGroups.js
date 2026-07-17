// AlbumScan — group near-duplicate photos via average hash (aHash).
// imageBuffer is raw 8-bit grayscale pixel data for a (roughly) square image;
// side = round(sqrt(length)). Pure JS, no image-decoding dependency.
// ponytail: assumes pre-decoded grayscale bytes — decoding PNG/JPEG needs a
// codec lib; keep that out of this module and feed it raw pixels upstream.

function averageHash(buffer) {
  const px = buffer;
  const n = px.length;
  if (n === 0) return 0n;
  const side = Math.max(1, Math.round(Math.sqrt(n))); // pads small imgs implicitly
  const grays = new Array(64);
  for (let gy = 0; gy < 8; gy++) {
    for (let gx = 0; gx < 8; gx++) {
      const sx0 = Math.floor((gx * side) / 8);
      const sx1 = Math.max(sx0 + 1, Math.floor(((gx + 1) * side) / 8));
      const sy0 = Math.floor((gy * side) / 8);
      const sy1 = Math.max(sy0 + 1, Math.floor(((gy + 1) * side) / 8));
      let sum = 0, count = 0;
      for (let y = sy0; y < sy1 && y < side; y++) {
        for (let x = sx0; x < sx1 && x < side; x++) {
          const idx = y * side + x;
          if (idx < n) { sum += px[idx]; count++; }
        }
      }
      grays[gy * 8 + gx] = count ? sum / count : 0;
    }
  }
  let sum = 0;
  for (let i = 0; i < 64; i++) sum += grays[i];
  const mean = sum / 64;
  let hash = 0n;
  for (let i = 0; i < 64; i++) {
    if (grays[i] >= mean) hash |= (1n << BigInt(i));
  }
  return hash;
}

function hammingDistance(hash1, hash2) {
  let xor = hash1 ^ hash2;
  let distance = 0;
  while (xor) {
    distance += Number(xor & 1n);
    xor >>= 1n;
  }
  return distance;
}

function findDuplicateGroups(photos, threshold = 0.9) {
  if (photos.length === 0) return [];
  if (threshold < 0) threshold = 0;
  if (threshold > 1) threshold = 1;
  const maxDistance = Math.floor((1 - threshold) * 64);
  const hashes = photos.map(p => ({ id: p.id, hash: averageHash(p.imageBuffer) }));
  const groups = [];
  const visited = new Set();
  for (let i = 0; i < hashes.length; i++) {
    if (visited.has(i)) continue;
    const group = [hashes[i].id];
    visited.add(i);
    for (let j = i + 1; j < hashes.length; j++) {
      if (visited.has(j)) continue;
      if (hammingDistance(hashes[i].hash, hashes[j].hash) <= maxDistance) {
        group.push(hashes[j].id);
        visited.add(j);
      }
    }
    if (group.length >= 2) {
      groups.push(group);
    }
  }
  return groups;
}

module.exports = { findDuplicateGroups };
