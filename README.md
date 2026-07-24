# AlbumScan

AlbumScan is a static, local interface demo for a possible photo-album digitization product. It does **not** perform AI analysis, restoration, face recognition, upload, billing, accounts, cloud storage, sharing, OAuth, email, or ZIP generation.

## Data sources

- `LOCAL_INPUT`: a file selected by the user. Its bytes stay in browser memory and are not read or stored by this demo.
- `DEMO_OUTPUT`: fictional gallery metadata and canvas illustrations generated from the explicit seed `albumscan-demo-v1`. They are unrelated to the selected image.
- `VERIFIED_SERVICE`: reserved for future connected services; none exist in this demo.

The same seed and fixture configuration produce byte-for-byte identical metadata. The page contains no network request API or form submission.

## Run

Serve the repository locally so the external fixture script can load:

```sh
python -m http.server 8000
```

Open `http://localhost:8000`.

## Tests

Requires Node.js 18 or newer:

```sh
node --test
```

The tests verify deterministic metadata, trust/source labels, absence of network primitives, and absence of fabricated connected-service success states. See [TEST_EVIDENCE.md](TEST_EVIDENCE.md) for the latest recorded verification.
