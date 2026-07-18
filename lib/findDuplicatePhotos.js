const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function findDuplicatePhotos(photoPaths) {
  if (!Array.isArray(photoPaths) || photoPaths.length === 0) return [];
  const uniquePaths = [...new Set(photoPaths)];
  const hashMap = new Map();
  const promises = uniquePaths.map((p) => {
    return new Promise((resolve) => {
      const absPath = path.resolve(p);
      fs.access(absPath, fs.constants.R_OK, (err) => {
        if (err) { resolve(); return; }
        const hash = crypto.createHash('md5');
        const stream = fs.createReadStream(absPath, { highWaterMark: 65536 });
        stream.on('data', (chunk) => hash.update(chunk));
        stream.on('end', () => {
          const digest = hash.digest('hex');
          if (!hashMap.has(digest)) hashMap.set(digest, []);
          hashMap.get(digest).push(absPath);
          resolve();
        });
        stream.on('error', () => resolve());
      });
    });
  });
  return Promise.all(promises).then(() => {
    const result = [];
    for (const group of hashMap.values()) {
      if (group.length >= 2) result.push(group);
    }
    return result;
  });
}

module.exports = { findDuplicatePhotos };