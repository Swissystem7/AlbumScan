"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const demo = require("../demo-fixtures.js");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const fixtureSource = fs.readFileSync(path.join(root, "demo-fixtures.js"), "utf8");
const config = {
  decades: { "1980": { years: [1981, 1984] }, "1990": { years: [1992, 1998] } },
  faces: ["Demo Person A", "Demo Person B"],
  captions: ["Demo fixture {year}"],
  paletteCount: 3,
  types: ["portrait", "group"]
};

test("same seed produces byte-for-byte equivalent metadata", () => {
  const first = JSON.stringify(demo.generateDemoPhotos("albumscan-demo-v1", config));
  const second = JSON.stringify(demo.generateDemoPhotos("albumscan-demo-v1", config));
  assert.equal(first, second);
});

test("trust labels and privacy statement are visible in source", () => {
  for (const label of ["DEMO", "LOCAL_INPUT", "DEMO_OUTPUT", "VERIFIED_SERVICE"]) {
    assert.match(html, new RegExp(label));
  }
  assert.match(html, /Image bytes never leave this browser/);
});

test("demo contains no network or fabricated service success primitives", () => {
  const combined = html + fixtureSource;
  assert.doesNotMatch(combined, /\bfetch\s*\(|XMLHttpRequest|<form\b/i);
  assert.doesNotMatch(combined, /albumscan\.app\/google|ZIP .*ready|purchase.*successful/i);
});
