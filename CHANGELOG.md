# Changelog

All notable changes to `n8n-nodes-palveron` will be documented in this file.

This project follows [Semantic Versioning](https://semver.org/).

## [1.0.0] — 2026-05-17

### Added
- Initial public release of `n8n-nodes-palveron` on npm
- `Palveron` community node — usable in any n8n workflow as a governance
  gate. Operations:
  - **Verify Prompt** — run a prompt through the Palveron gateway and
    branch the workflow on `ALLOWED` / `BLOCKED` / `MODIFIED`
  - **List Policies** — pull the project's active guardrails into the
    workflow data
  - **Check Health** — gateway readiness probe for fail-fast workflows
- `PalveronApi` credential type with `apiKey` and optional
  on-prem `baseUrl` fields
- Compatible with n8n's community-node loader (`n8n.n8nNodesApiVersion: 1`)
