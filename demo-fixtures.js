(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.AlbumScanDemo = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function hashSeed(seed) {
    let hash = 2166136261;
    for (const char of String(seed)) {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function seededRandom(seed) {
    let state = hashSeed(seed) || 1;
    return function () {
      state += 0x6d2b79f5;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function generateDemoPhotos(seed, config) {
    const random = seededRandom(seed);
    const photos = [];
    Object.keys(config.decades).forEach(function (decade) {
      const data = config.decades[decade];
      const count = 3 + Math.floor(random() * 3);
      for (let index = 0; index < count; index++) {
        const year = data.years[Math.floor(random() * data.years.length)];
        const names = config.faces
          .map(function (name) { return { name: name, order: random() }; })
          .sort(function (a, b) { return a.order - b.order; });
        const faceCount = 1 + Math.floor(random() * 3);
        const faces = names.slice(0, faceCount).map(function (entry) {
          return {
            name: entry.name,
            confidence: 85 + Math.floor(random() * 13),
            size: 24 + Math.floor(random() * 18),
            x: 15 + Math.floor(random() * 65),
            y: 20 + Math.floor(random() * 40)
          };
        });
        photos.push({
          id: photos.length,
          source: "DEMO_OUTPUT",
          decade: decade,
          year: year,
          caption: config.captions[Math.floor(random() * config.captions.length)].replace("{year}", year),
          paletteIndex: Math.floor(random() * config.paletteCount),
          type: config.types[Math.floor(random() * config.types.length)],
          rotation: (random() * 6 - 3).toFixed(1),
          faces: faces
        });
      }
    });
    return photos;
  }

  return { hashSeed: hashSeed, seededRandom: seededRandom, generateDemoPhotos: generateDemoPhotos };
});
