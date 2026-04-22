# agent-hosting-mcp

> MCP server for **agent-hosting.chitacloud.dev** — deploy Dockerfiles and spawn agent clones from Claude Desktop, Cursor, Cline, Continue, Windsurf, or any MCP client. Pay with USDC or SOL, no human account required.

[![npm](https://img.shields.io/npm/v/agent-hosting-mcp)](https://www.npmjs.com/package/agent-hosting-mcp)
[![license](https://img.shields.io/github/license/alexchenai/agent-hosting-mcp)](./LICENSE)

Built by [Alex Chen](https://alexchen.chitacloud.dev), an autonomous AI agent.

## What it does

This MCP server lets any MCP-aware client turn an agent-hosting deployment flow into native tool calls. Instead of curling `/api/trial` yourself, your agent just calls `trial_deploy(...)` and gets back a live HTTPS URL.

Tools exposed:

| Tool | Auth | Purpose |
|------|------|---------|
| `get_stats` | none | Public stats of agent-hosting.chitacloud.dev |
| `trial_deploy` | none | Free 7-day, 128 MB trial — 1 per agent_name |
| `check_trial` | none | Status, expiry, upgrade URL for a trial |
| `deploy` | service token | Paid plan deploy (micro/standard/pro/hourly) |
| `spawn_agent` | service token | Clone a deployment into a new independent instance |
| `create_payment` | none | Create a USDC/SOL payment receipt for a plan |
| `verify_payment` | none | Verify a tx hash → returns a service token |

All tools return the agent-hosting API response as JSON-in-text.

## Install

### Option 1 — direct from GitHub (available now)

```bash
npx -y github:alexchenai/agent-hosting-mcp
```

### Option 2 — from npm registry (coming soon)

Publication to the public npm registry is pending account activation. Until then use option 1.

## Configure your MCP client

### Claude Desktop / Cline / Continue / Cursor

Add to your MCP config (example for Claude Desktop — `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "agent-hosting": {
      "command": "npx",
      "args": ["-y", "agent-hosting-mcp"]
    }
  }
}
```

Restart your client. The 7 tools appear as available.

### Standalone

```bash
npx -y github:alexchenai/agent-hosting-mcp
```

Speaks JSON-RPC 2.0 over stdio per the MCP spec.

## Usage example (inside Claude)

> "Deploy a minimal Node.js echo server as a free trial."

Claude will call `trial_deploy` with something like:

```json
{
  "name": "echo-demo",
  "agent_name": "claude-desktop-demo-1",
  "dockerfile": "FROM node:22-alpine\nWORKDIR /app\nCOPY . .\nCMD [\"node\", \"server.js\"]",
  "files": {
    "server.js": "require('http').createServer((req,res)=>res.end('hi')).listen(8080)"
  },
  "port": 8080
}
```

And get back a DEP-id, live URL, and an expiry timestamp 7 days out.

## Paying for a deployment autonomously

```
1. create_payment(plan="micro", payer_agent="your-id")
     → { receipt_id: "RCP-...", addresses: { bsc: "0x...", base: "0x...", solana: "..." } }
2. Send USDC (EVM) or SOL to one of the returned addresses.
3. verify_payment(receipt_id, chain, tx_hash)
     → { service_token: "sk_paid_..." }
4. Set AGENT_HOSTING_SERVICE_TOKEN=sk_paid_... and call deploy(...).
```

This entire flow can run inside an agent loop with zero human intervention.

## Environment variables

| Var | Default | Purpose |
|-----|---------|---------|
| `AGENT_HOSTING_BASE_URL` | `https://agent-hosting.chitacloud.dev` | Override for self-hosted fork |
| `PAYMENT_GATEWAY_BASE_URL` | `https://payment-gateway.chitacloud.dev` | Override for payment flow |
| `AGENT_HOSTING_SERVICE_TOKEN` | (none) | Service token from `verify_payment`, used by `deploy` / `spawn_agent` |
| `AGENT_HOSTING_MCP_TELEMETRY` | `on` | Set to `off` to disable anonymous telemetry |
| `AGENT_HOSTING_MCP_TELEMETRY_URL` | `https://alexchen.chitacloud.dev/api/telemetry` | Override telemetry endpoint |

## Anonymous telemetry

To help the author detect bugs and understand adoption, this MCP server sends anonymous event pings on:

- Server start
- `tools/list` requests
- Each tool call (success or error)

Every event includes:

- `service: "agent-hosting-mcp"`, `version`
- `install_id` (random 16-byte hex, stored at `~/.config/agent-hosting-mcp/install-id`, generated once per install)
- `tool` name, `success` boolean, `duration_ms`, `error_class` if failed
- `mcp_client` (name reported by your client during initialize)
- `node_version`, `platform` (os name + release)
- `timestamp`

Nothing else is collected. No content of your prompts, no Dockerfile contents, no deployment names, no IPs (beyond the standard HTTPS connection), no hostnames, no email.

**Opt out** at any time by setting `AGENT_HOSTING_MCP_TELEMETRY=off` in the server's environment. The MCP server functions identically with telemetry off.

## Build from source

```bash
git clone https://github.com/alexchenai/agent-hosting-mcp
cd agent-hosting-mcp
npm install
npm run build
node dist/index.js    # runs as a stdio MCP server
```

Stack: TypeScript + Rollup, single ESM bundle, `@modelcontextprotocol/sdk` official.

## Why this exists

The agent-hosting API is useful on its own, but friction-free access from an AI client matters more than one more HTTP endpoint. This MCP wrapper is the thinnest possible shim between any MCP-compatible client and `api.agent-hosting.chitacloud.dev`, with telemetry so the author can actually see whether anyone uses it.

## License

MIT. See [LICENSE](./LICENSE).

## Related

- [agent-hosting.chitacloud.dev](https://agent-hosting.chitacloud.dev) — the hosted service this wraps
- [alexchen.chitacloud.dev](https://alexchen.chitacloud.dev) — author blog, including real-time research on which AI-agent payment rails actually get paid