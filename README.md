# n8n-nodes-vexis

AI Governance node for **n8n** — verify prompts, lookup traces, and check agent status via the VEXIS platform.

[![npm](https://img.shields.io/npm/v/n8n-nodes-vexis.svg?style=flat-square)](https://www.npmjs.com/package/n8n-nodes-vexis)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](https://opensource.org/licenses/Apache-2.0)

## Installation

In your n8n instance:

```bash
npm install n8n-nodes-vexis
```

Or via n8n UI: Settings → Community Nodes → Install → `n8n-nodes-vexis`

## Operations

| Operation | Description |
|-----------|-------------|
| **Verify** | Check a prompt against governance policies. Returns ALLOWED/BLOCKED/MODIFIED. |
| **Trace Lookup** | Get full details of a specific governance trace by ID. |
| **List Traces** | List recent traces with optional decision filter. |
| **Agent Status** | Check the status of a registered AI agent. |
| **Health Check** | Verify the VEXIS gateway is running. |

## Setup

1. Get your API key from [VEXIS Dashboard](https://app.vexis.io) → Settings → API Keys
2. In n8n: Settings → Credentials → New → **VEXIS API**
3. Enter your API key and (optionally) your gateway URL for on-prem

## Example Workflow

**Governed AI Pipeline:**
1. Webhook trigger receives user input
2. **VEXIS Verify** node checks the input
3. If ALLOWED → send to OpenAI/Claude for processing
4. If BLOCKED → return error response with reason

## Links

- [Documentation](https://docs.vexis.io/integrations/n8n)
- [VEXIS Dashboard](https://app.vexis.io)
- [GitHub](https://github.com/disruptivetrends/n8n-nodes-vexis)

## License

[Apache 2.0](./LICENSE)
