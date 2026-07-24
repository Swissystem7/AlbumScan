# Test evidence

## AS-001 demo trust layer

- Determinism: the same explicit seed and fixture configuration serialize to identical metadata.
- Network isolation: static checks reject `fetch`, `XMLHttpRequest`, and HTML form submission.
- Provenance: the UI and tests require `LOCAL_INPUT`, `DEMO_OUTPUT`, and `VERIFIED_SERVICE` labels.
- Honest states: billing, account, sharing, OAuth, email, and ZIP actions report that they are not connected.
- Privacy: the selected image is not read, persisted, or transmitted.

Run `node --test` from the repository root to reproduce the checks.
