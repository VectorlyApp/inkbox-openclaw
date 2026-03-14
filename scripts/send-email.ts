import { Inkbox } from "@inkbox/sdk";

const args = process.argv.slice(2);
const get = (flag: string) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : undefined;
};

const parseRecipients = (value?: string) =>
  value
    ? value
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
    : undefined;

const to = parseRecipients(get("--to"));
const subject = get("--subject");
const body = get("--body");
const cc = parseRecipients(get("--cc"));
const bcc = parseRecipients(get("--bcc"));
const replyTo = get("--replyTo");

if (!to?.length || !subject || !body) {
  console.error(JSON.stringify({ error: "Missing required args: --to, --subject, --body" }));
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

const message = await identity.sendEmail({
  to,
  subject,
  bodyText: body,
  ...(cc?.length ? { cc } : {}),
  ...(bcc?.length ? { bcc } : {}),
  ...(replyTo ? { inReplyToMessageId: replyTo } : {}),
});

console.log(JSON.stringify(message, null, 2));
