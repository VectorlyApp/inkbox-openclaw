import { Inkbox } from "@inkbox/sdk";

const args = process.argv.slice(2);
const get = (flag: string) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : undefined;
};

const query = get("--query");
const limit = parseInt(get("--limit") ?? "10", 10);

if (!query) {
  console.error(JSON.stringify({ error: "Missing required arg: --query" }));
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

const mailbox = identity.mailbox;
if (!mailbox) {
  console.error(JSON.stringify({ error: "No mailbox linked to this identity" }));
  process.exit(1);
}

const results = await inkbox.mailboxes.search(mailbox.emailAddress, { q: query, limit });

console.log(JSON.stringify(results, null, 2));
