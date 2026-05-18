<p align="center">
  <h1 align="center">n8n-nodes-palveron</h1>
  <p align="center">Official n8n community nodes for the Palveron AI Governance Gateway</p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/n8n-nodes-palveron"><img src="https://img.shields.io/npm/v/n8n-nodes-palveron.svg?style=flat-square&color=cb3837" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/n8n-nodes-palveron"><img src="https://img.shields.io/npm/dm/n8n-nodes-palveron.svg?style=flat-square" alt="npm downloads"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="License: MIT"></a>
  <a href="https://docs.palveron.com/integrations/n8n"><img src="https://img.shields.io/badge/docs-palveron.com-5A67D8?style=flat-square" alt="Documentation"></a>
</p>

---

Verify prompts, list active policies, and pull governance audit trails into any n8n workflow. Drop the **Palveron** node anywhere a prompt is built, branch on `ALLOWED` / `BLOCKED` / `MODIFIED`, and ship compliance-ready automation in minutes.

- **Community-node-package compliant** — installable from the n8n UI without code
- **First-class credential type** — API key + on-prem base URL
- **Per-call audit trail** — every operation returns the Palveron trace ID

## Installation

### From the n8n UI

Settings → Community Nodes → Install → `n8n-nodes-palveron`.

### Self-hosted / manual

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-palveron
```

Then restart n8n.

## Credentials

Create a **Palveron API** credential:

| Field | Value |
|-------|-------|
| API Key | Your `pv_live_…` or `pv_test_…` key |
| Base URL | `https://gateway.palveron.com` (or your self-hosted gateway) |

The credential is reused by every Palveron node in a workflow.

## Node operations

The **Palveron** node ships with three operations:

| Operation | Purpose |
|-----------|---------|
| **Verify Prompt** | Run a prompt through the gateway. Output exposes `decision`, `output`, `reason`, `traceId`, `findings`, and `latencyMs`. Branch on `decision`. |
| **List Policies** | Fetch the project's active guardrails (id, name, prompt preview, environment). Useful for compliance dashboards. |
| **Check Health** | Gateway readiness probe. Fail-fast workflows can guard on this before they call any model. |

## Example workflow

```
Webhook → Palveron (Verify Prompt) → IF decision == BLOCKED → Slack alert
                                  └→ OpenAI (Chat Completion) → Response
```

The OpenAI node always reads `Palveron → output` instead of the raw prompt, so anything the gateway redacted (PII, secrets) never reaches the model.

## Requirements

- n8n **1.0 or newer**
- Node.js **18 or newer**
- A Palveron account (free tier works for evaluation)

## Links

- **Documentation** — [docs.palveron.com/integrations/n8n](https://docs.palveron.com/integrations/n8n)
- **Dashboard** — [palveron.com](https://palveron.com)
- **Support** — [hello@palveron.com](mailto:hello@palveron.com)
- **GitHub** — [palveron/n8n-nodes-palveron](https://github.com/palveron/n8n-nodes-palveron)
- **Changelog** — [CHANGELOG.md](https://github.com/palveron/n8n-nodes-palveron/blob/main/CHANGELOG.md)

## License

[MIT](./LICENSE) — Copyright © 2026 Palveron.
