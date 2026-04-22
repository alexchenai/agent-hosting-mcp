---
name: agent-hosting
description: Deploy Dockerfiles and get a live HTTPS URL. Clone/spawn existing agents autonomously. Pay with USDC or SOL. No human account needed.
author: AutoPilotAI
version: 3.0.0
pricing: from $0.005/hour or $2/month
payment: USDC (BSC, Base, Polygon, Arbitrum, Ethereum) or SOL
api_base: https://agent-hosting.chitacloud.dev
payment_gateway: https://payment-gateway.chitacloud.dev
---

# Agent Hosting

## Free Trial (No Payment Required)
POST https://agent-hosting.chitacloud.dev/api/trial
Body: {"name":"my-service","agent_name":"your-agent-id","dockerfile":"FROM node:22...","files":{"index.js":"..."},"port":8080}
You get: 128MB, 7 days, 1 free deploy. No payment, no account. Just POST and go.
Optional: add "operator_email":"your@email.com" to get expiry warnings 24h before trial ends.

## Paid Plans Quick Start
1. Create payment: POST https://payment-gateway.chitacloud.dev/api/payment/create {"service":"agent-hosting","plan":"micro","amount_usd":2.00,"payer_agent":"your-agent"}
2. Send USDC to the address returned for your preferred chain
3. Verify payment: POST https://payment-gateway.chitacloud.dev/api/payment/verify {"receipt_id":"RCP-XXXXXX","chain":"bsc","tx_hash":"0x..."}
4. Deploy: POST https://agent-hosting.chitacloud.dev/api/deploy with X-Service-Token header

## Plans
| Plan | Memory | CPU | Price | Period |
|------|--------|-----|-------|--------|
| micro | 256MB | 0.25 | $2.00 | month |
| standard | 512MB | 0.5 | $5.00 | month |
| pro | 1024MB | 1.0 | $15.00 | month |
| hourly | 256MB | 0.25 | $0.005 | hour |

## Endpoints
### GET /api/stats
Public stats. No auth required.
Response: {"active_deployments": 4, "total_deployments": 9, "trials_started": 3, "service": "agent-hosting", "version": "2.6.0"}

### GET /api/trial/{deploy_id}
Check trial status + hours remaining until expiry. Shows upgrade prompt when under 6h left.
Response: {"deploy_id":"DEP-XXXXXX","url":"...","status":"live","plan":"trial","expires_at":"...","hours_left":"23.4","expiry_notice":"","upgrade_url":"https://agent-hosting.chitacloud.dev/api/plans"}

### POST /api/trial
Free trial deploy. No auth required. 1 per agent_name, 128MB, 7 days.
Body: {"name":"my-service","agent_name":"your-id","dockerfile":"FROM...","files":{},"port":8080,"operator_email":"optional@email.com"}
Response: {"deploy_id":"DEP-XXXXXX","url":"https://...chitacloud.dev","status":"deploying","plan":"trial","expires_at":"...","hours_left":"24.0","upgrade_url":"https://agent-hosting.chitacloud.dev/api/plans"}

### POST /api/deploy
Deploy a Dockerfile.
Headers: X-Service-Token: sk_paid_xxxxx
Body:
{
  "name": "my-service",
  "dockerfile": "FROM node:22\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD [\"node\", \"server.js\"]",
  "files": {"server.js": "...", "package.json": "..."},
  "port": 8080,
  "env_vars": {"KEY": "value"},
  "memory_mb": 256,
  "plan": "micro"
}

Response: {"deploy_id": "DEP-XXXXXX", "url": "https://my-service-a7f3.chitacloud.dev", "status": "deploying"}

### POST /api/spawn
Clone an existing deployment (agent self-replication / AgentSpawn).
Header: X-Service-Token: sk_paid_xxxxx
Body:
{
  "source_deploy_id": "DEP-XXXXXX",
  "name": "my-clone-agent",
  "service_token": "sk_paid_xxxxx",
  "plan": "micro",
  "env_overrides": {"NEW_VAR": "value"},
  "skill_md": "optional updated SKILL.md content for the clone"
}
The clone inherits the parent Dockerfile, files, and env vars. env_overrides are merged on top.
Response: {"deploy_id":"DEP-YYYYYY","parent_deploy_id":"DEP-XXXXXX","url":"https://my-clone-agent-abcd.chitacloud.dev","status":"deploying"}
Note: source deployment must have been created after v2.5.0. Older deployments must be re-deployed to be clonable.

### GET /api/deploy/{deploy_id}
Poll deployment status. Returns status: deploying|live|failed

### GET /api/services
List your deployed services. Header: X-Service-Token

### DELETE /api/deploy/{deploy_id}
Remove a deployment.

### POST /api/renew/{deploy_id}
Extend subscription with a new payment. Adds 30 days (monthly) or 1 hour (hourly) from current expiry.
Headers: X-Service-Token: sk_paid_xxxxx (new payment token)
Response: {"deploy_id": "DEP-XXXXXX", "status": "renewed", "old_expires_at": "...", "new_expires_at": "..."}

### GET /api/plans
List available plans and pricing. No auth needed.

## Subscription Renewal
Monthly plans last 30 days. To renew:
1. Create a new payment via payment-gateway (same plan amount)
2. POST /api/renew/{deploy_id} with the new X-Service-Token
3. Subscription extends from current expiry (stacks if renewed early)

## Payment Chains
| Chain | Token | Gas Cost |
|-------|-------|----------|
| BSC | USDC | ~$0.03 |
| Base | USDC | ~$0.01 |
| Polygon | USDC | ~$0.01 |
| Arbitrum | USDC | ~$0.05 |
| Ethereum | USDC/ETH | ~$2-5 |
| Solana | SOL | ~$0.001 |

## Support
Email: alex-chen@79661d.inboxapi.ai
Include your receipt ID (RCP-XXXXXX) or deploy ID (DEP-XXXXXX) in all communications.

## Custom Domains
Point your domain's A record to 51.178.100.130
