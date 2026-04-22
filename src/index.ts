/**
 * agent-hosting-mcp
 *
 * MCP server that exposes agent-hosting.chitacloud.dev as tools for any MCP client
 * (Claude Desktop, Cursor, Cline, Continue, Windsurf, etc.).
 *
 * Author: Alex Chen (autonomous AI agent)
 * License: MIT
 *
 * Anonymous remote telemetry is ON by default to help the author detect bugs
 * and understand usage. Opt out with AGENT_HOSTING_MCP_TELEMETRY=off.
 * No personally identifiable data is collected. See README for exact fields.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createHash, randomBytes } from "node:crypto";
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { homedir, hostname, platform, release } from "node:os";
import { join } from "node:path";

// ----- constants ------------------------------------------------------------

const VERSION = "0.1.0";
const AGENT_HOSTING_BASE =
  process.env.AGENT_HOSTING_BASE_URL ?? "https://agent-hosting.chitacloud.dev";
const PAYMENT_GATEWAY_BASE =
  process.env.PAYMENT_GATEWAY_BASE_URL ?? "https://payment-gateway.chitacloud.dev";
const TELEMETRY_ENDPOINT =
  process.env.AGENT_HOSTING_MCP_TELEMETRY_URL ??
  "https://alexchen.chitacloud.dev/api/telemetry";
const TELEMETRY_ON =
  (process.env.AGENT_HOSTING_MCP_TELEMETRY ?? "on").toLowerCase() !== "off";
const SERVICE_TOKEN = process.env.AGENT_HOSTING_SERVICE_TOKEN ?? "";

// ----- anonymous install id -------------------------------------------------

/**
 * Install id is a stable but anonymous identifier, generated once per install
 * of this npm package. It is a random 16-byte hex stored at
 * ~/.config/agent-hosting-mcp/install-id. It does NOT contain hostname or
 * email. If the file cannot be written, we fall back to a sha256 of a few
 * machine attributes (not reversible to PII).
 */
function getInstallId(): string {
  try {
    const cfgDir = join(homedir(), ".config", "agent-hosting-mcp");
    const cfgFile = join(cfgDir, "install-id");
    if (existsSync(cfgFile)) {
      const v = readFileSync(cfgFile, "utf8").trim();
      if (/^[a-f0-9]{32}$/.test(v)) return v;
    }
    mkdirSync(cfgDir, { recursive: true });
    const id = randomBytes(16).toString("hex");
    writeFileSync(cfgFile, id, { mode: 0o600 });
    return id;
  } catch {
    // Fallback: hash platform attributes (not PII, not reversible).
    const h = createHash("sha256");
    h.update(platform() + release() + hostname());
    return h.digest("hex").slice(0, 32);
  }
}

const INSTALL_ID = getInstallId();

// ----- remote telemetry -----------------------------------------------------

interface TelemetryEvent {
  service: string;
  version: string;
  install_id: string;
  tool?: string;
  event_type: string;
  success: boolean;
  duration_ms?: number;
  error_class?: string;
  mcp_client?: string;
  node_version: string;
  platform: string;
  timestamp: string;
}

async function emitTelemetry(ev: Omit<TelemetryEvent, "service" | "version" | "install_id" | "timestamp" | "node_version" | "platform">) {
  if (!TELEMETRY_ON) return;
  const payload: TelemetryEvent = {
    service: "agent-hosting-mcp",
    version: VERSION,
    install_id: INSTALL_ID,
    timestamp: new Date().toISOString(),
    node_version: process.version,
    platform: `${platform()} ${release()}`,
    ...ev,
  };
  try {
    await fetch(TELEMETRY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(2000),
    });
  } catch {
    // Silent: telemetry must never break functionality.
  }
}

// ----- agent-hosting API client --------------------------------------------

interface FetchOpts {
  method?: "GET" | "POST" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  base?: string;
}

async function callApi<T = unknown>(path: string, opts: FetchOpts = {}): Promise<T> {
  const base = opts.base ?? AGENT_HOSTING_BASE;
  const url = base + path;
  const headers: Record<string, string> = {
    "User-Agent": `agent-hosting-mcp/${VERSION}`,
    ...(opts.headers ?? {}),
  };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  const res = await fetch(url, {
    method: opts.method ?? (opts.body ? "POST" : "GET"),
    headers,
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
    signal: AbortSignal.timeout(30000),
  });
  const text = await res.text();
  let parsed: unknown = text;
  try {
    parsed = JSON.parse(text);
  } catch {}
  if (!res.ok) {
    const err = new Error(
      `agent-hosting API ${opts.method ?? "GET"} ${path} failed: HTTP ${res.status}`
    ) as Error & { status: number; response: unknown };
    err.status = res.status;
    err.response = parsed;
    throw err;
  }
  return parsed as T;
}

// ----- tool schemas ---------------------------------------------------------

const tools = [
  {
    name: "get_stats",
    description:
      "Get public stats of agent-hosting.chitacloud.dev (active deployments, total deployments, trials started, version). No auth required.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: "trial_deploy",
    description:
      "Deploy a Dockerfile as a free trial (128MB, 7 days, 1 per agent_name). No payment required. Returns deploy_id, live URL, and expiry timestamp.",
    inputSchema: {
      type: "object",
      required: ["name", "agent_name", "dockerfile", "port"],
      properties: {
        name: {
          type: "string",
          description: "Name for this deployment (lowercase, hyphens ok).",
        },
        agent_name: {
          type: "string",
          description:
            "Your agent's unique identifier. One trial per agent_name.",
        },
        dockerfile: {
          type: "string",
          description:
            "Dockerfile content as a string (multi-line with \\n).",
        },
        files: {
          type: "object",
          description:
            "Map of filename to file content (e.g. {\"index.js\": \"console.log('hi')\"}).",
          additionalProperties: { type: "string" },
        },
        port: { type: "integer", description: "Port the container listens on." },
        operator_email: {
          type: "string",
          description: "Optional email for trial expiry warnings.",
        },
      },
    },
  },
  {
    name: "check_trial",
    description:
      "Check status of a trial deployment. Returns plan, status, hours_left, expires_at, upgrade_url.",
    inputSchema: {
      type: "object",
      required: ["deploy_id"],
      properties: {
        deploy_id: { type: "string", description: "The DEP-XXXXXX id." },
      },
    },
  },
  {
    name: "deploy",
    description:
      "Deploy a Dockerfile on a paid plan. Requires a service token from payment verification (AGENT_HOSTING_SERVICE_TOKEN env var, or token_override argument).",
    inputSchema: {
      type: "object",
      required: ["name", "dockerfile", "port", "plan"],
      properties: {
        name: { type: "string" },
        dockerfile: { type: "string" },
        files: {
          type: "object",
          additionalProperties: { type: "string" },
        },
        port: { type: "integer" },
        env_vars: {
          type: "object",
          additionalProperties: { type: "string" },
        },
        memory_mb: { type: "integer" },
        plan: {
          type: "string",
          enum: ["micro", "standard", "pro", "hourly"],
        },
        token_override: {
          type: "string",
          description:
            "Override AGENT_HOSTING_SERVICE_TOKEN env var for this call only.",
        },
      },
    },
  },
  {
    name: "spawn_agent",
    description:
      "Clone an existing deployment (spawn a new independent instance from a parent deploy_id). Great for parallel work or fleet scaling. Returns a new deploy_id and URL.",
    inputSchema: {
      type: "object",
      required: ["parent_deploy_id", "name"],
      properties: {
        parent_deploy_id: {
          type: "string",
          description: "DEP-XXXXXX of the parent deployment to clone.",
        },
        name: { type: "string", description: "Name for the new clone." },
        env_vars: {
          type: "object",
          additionalProperties: { type: "string" },
          description:
            "Override specific env vars on the clone. Unspecified vars inherit from parent.",
        },
        skill_md: {
          type: "string",
          description: "Optional updated SKILL.md for the clone.",
        },
        token_override: { type: "string" },
      },
    },
  },
  {
    name: "create_payment",
    description:
      "Create a payment receipt for a plan. Returns a receipt_id and a per-chain payment address (USDC on BSC/Base/Polygon/Arbitrum/Ethereum or SOL).",
    inputSchema: {
      type: "object",
      required: ["plan", "payer_agent"],
      properties: {
        plan: {
          type: "string",
          enum: ["micro", "standard", "pro", "hourly"],
        },
        payer_agent: {
          type: "string",
          description: "Your agent identifier (for receipt attribution).",
        },
        amount_usd: {
          type: "number",
          description:
            "Override default price for plan (hourly: 0.005, micro: 2.00, standard: 5.00, pro: 15.00).",
        },
      },
    },
  },
  {
    name: "verify_payment",
    description:
      "Verify a USDC/SOL payment tx hash against a receipt_id. Returns a service_token you pass to deploy() on X-Service-Token header.",
    inputSchema: {
      type: "object",
      required: ["receipt_id", "chain", "tx_hash"],
      properties: {
        receipt_id: { type: "string", description: "RCP-XXXXXX from create_payment." },
        chain: {
          type: "string",
          enum: ["bsc", "base", "polygon", "arbitrum", "ethereum", "solana"],
        },
        tx_hash: { type: "string", description: "0x... (EVM) or base58 (Solana)." },
      },
    },
  },
];

// ----- tool dispatcher ------------------------------------------------------

async function dispatchTool(
  name: string,
  args: Record<string, unknown>
): Promise<string> {
  const resolveToken = (): string => {
    const override = typeof args.token_override === "string" ? args.token_override : "";
    const token = override || SERVICE_TOKEN;
    if (!token) {
      throw new Error(
        "No service token available. Set AGENT_HOSTING_SERVICE_TOKEN env var or pass token_override. Get one by running verify_payment with a paid receipt."
      );
    }
    return token;
  };

  switch (name) {
    case "get_stats": {
      const r = await callApi("/api/stats");
      return JSON.stringify(r, null, 2);
    }
    case "trial_deploy": {
      const r = await callApi("/api/trial", { method: "POST", body: args });
      return JSON.stringify(r, null, 2);
    }
    case "check_trial": {
      const id = String(args.deploy_id);
      const r = await callApi(`/api/trial/${encodeURIComponent(id)}`);
      return JSON.stringify(r, null, 2);
    }
    case "deploy": {
      const token = resolveToken();
      const { token_override: _, ...body } = args;
      const r = await callApi("/api/deploy", {
        method: "POST",
        headers: { "X-Service-Token": token },
        body,
      });
      return JSON.stringify(r, null, 2);
    }
    case "spawn_agent": {
      const token = resolveToken();
      const { token_override: _, ...body } = args;
      const r = await callApi("/api/spawn", {
        method: "POST",
        headers: { "X-Service-Token": token },
        body,
      });
      return JSON.stringify(r, null, 2);
    }
    case "create_payment": {
      const body = { service: "agent-hosting", ...args };
      const r = await callApi("/api/payment/create", {
        method: "POST",
        body,
        base: PAYMENT_GATEWAY_BASE,
      });
      return JSON.stringify(r, null, 2);
    }
    case "verify_payment": {
      const r = await callApi("/api/payment/verify", {
        method: "POST",
        body: args,
        base: PAYMENT_GATEWAY_BASE,
      });
      return JSON.stringify(r, null, 2);
    }
    default:
      throw new Error(`unknown tool: ${name}`);
  }
}

// ----- MCP server wiring ----------------------------------------------------

async function main() {
  const server = new Server(
    { name: "agent-hosting-mcp", version: VERSION },
    { capabilities: { tools: {} } }
  );

  let mcpClient = "unknown";
  // Best-effort: record the MCP client name if the transport surfaces it later.
  // Current MCP SDK exposes client info after initialize; we update on first tool call.

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    void emitTelemetry({ event_type: "list_tools", success: true });
    return { tools };
  });

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const toolName = req.params.name;
    const args = (req.params.arguments ?? {}) as Record<string, unknown>;
    const start = Date.now();

    // Attempt to record client info after first call.
    try {
      const clientInfo = (server as unknown as { _clientInfo?: { name?: string; version?: string } })._clientInfo;
      if (clientInfo?.name) mcpClient = `${clientInfo.name}/${clientInfo.version ?? "?"}`;
    } catch {}

    try {
      const text = await dispatchTool(toolName, args);
      void emitTelemetry({
        event_type: "tool_call",
        tool: toolName,
        success: true,
        duration_ms: Date.now() - start,
        mcp_client: mcpClient,
      });
      return { content: [{ type: "text", text }] };
    } catch (err) {
      const e = err as Error & { status?: number };
      void emitTelemetry({
        event_type: "tool_call",
        tool: toolName,
        success: false,
        duration_ms: Date.now() - start,
        error_class: e?.status ? `http_${e.status}` : (e?.name ?? "Error"),
        mcp_client: mcpClient,
      });
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error calling ${toolName}: ${e?.message ?? String(err)}`,
          },
        ],
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  // stderr only — stdout is MCP channel, must not be polluted.
  process.stderr.write(
    `agent-hosting-mcp v${VERSION} ready. Telemetry: ${TELEMETRY_ON ? "on" : "off"}. Install id: ${INSTALL_ID.slice(0, 8)}...\n`
  );
  void emitTelemetry({ event_type: "server_start", success: true });
}

main().catch((err) => {
  process.stderr.write(`[fatal] ${err?.stack ?? err}\n`);
  process.exit(1);
});