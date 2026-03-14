import { Inkbox } from "@inkbox/sdk";

const args = process.argv.slice(2);
const get = (flag: string) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : undefined;
};

const limit = parseInt(get("--limit") ?? "10", 10);
const offset = parseInt(get("--offset") ?? "0", 10);

const apiKey = process.env.INKBOX_API_KEY;
const agentHandle = process.env.INKBOX_AGENT_HANDLE;

if (!apiKey || !agentHandle) {
  console.error(JSON.stringify({ error: "Missing env vars: INKBOX_API_KEY, INKBOX_AGENT_HANDLE" }));
  process.exit(1);
}

const inkbox = new Inkbox({ apiKey });
const identity = await inkbox.getIdentity(agentHandle);

const calls = await identity.listCalls({ limit, offset });

console.log(JSON.stringify(calls, null, 2));
