import { Inkbox } from "@inkbox/sdk";

const args = process.argv.slice(2);
const get = (flag: string) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : undefined;
};

const to = get("--to");
const clientWebsocketUrl = get("--clientWebsocketUrl");

if (!to) {
  console.error(JSON.stringify({ error: "Missing required args: --to" }));
  process.exit(1);
}

const apiKey = process.env.INKBOX_API_KEY;
const agentHandle = process.env.INKBOX_AGENT_HANDLE;

if (!apiKey || !agentHandle) {
  console.error(JSON.stringify({ error: "Missing env vars: INKBOX_API_KEY, INKBOX_AGENT_HANDLE" }));
  process.exit(1);
}

const inkbox = new Inkbox({ apiKey });
const identity = await inkbox.getIdentity(agentHandle);

const call = await identity.placeCall({
  toNumber: to,
  ...(clientWebsocketUrl && { clientWebsocketUrl }),
});

console.log(JSON.stringify(call, null, 2));
