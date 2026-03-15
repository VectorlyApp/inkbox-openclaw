# inkbox — OpenClaw Skill

An [OpenClaw](https://openclaw.ai) skill for email and phone via [Inkbox](https://www.inkbox.ai) agent identities.

## What it does

Once installed, your OpenClaw agent can:

- **Send emails** — compose and send from an Inkbox agent mailbox
- **Read inbox** — list recent or unread messages
- **View threads** — fetch full email conversations
- **Search email** — full-text search across a mailbox
- **Place calls** — make outbound phone calls (with optional WebSocket audio bridge)
- **List call history** — review past calls
- **Get transcripts** — retrieve call transcripts

## Requirements

- Node.js ≥ 18
- An [Inkbox](https://www.inkbox.ai) account with an API key
- An agent identity provisioned in Inkbox (with a mailbox and/or phone number as needed)

## Setup

### 1. Get an Inkbox API key

Sign in at [console.inkbox.ai](https://console.inkbox.ai) and create an API key.

### 2. Create an agent identity (if you haven't already)

You can create an identity in the [Inkbox console](https://console.inkbox.ai), or programmatically:

```ts
import { Inkbox } from "@inkbox/sdk";

const inkbox = new Inkbox({ apiKey: "ApiKey_..." });
const identity = await inkbox.createIdentity("my-agent");
await identity.createMailbox({ displayName: "My Agent" });

console.log(identity.mailbox?.emailAddress); // e.g. abc-xyz@inkboxmail.com
```

### 3. Install the skill

```bash
npm install
mkdir -p ~/.openclaw/skills/inkbox
cp -r . ~/.openclaw/skills/inkbox
```

### 4. Configure env vars in OpenClaw

Add both vars to `~/.openclaw/openclaw.json` under `skills.entries.inkbox.env`:

```json
{
  "skills": {
    "entries": {
      "inkbox": {
        "enabled": true,
        "env": {
          "INKBOX_API_KEY": "ApiKey_...",
          "INKBOX_AGENT_HANDLE": "my-agent"
        }
      }
    }
  }
}
```

Then restart the gateway:

```bash
openclaw gateway restart
```

## Usage

Once installed, just talk to your OpenClaw agent naturally:

> "Check my inbox"
> "Send an email to alice@example.com with subject 'Hello' and say hi"
> "Search my email for invoices"
> "Show me the full thread for that last message"
> "Call +15551234567"
> "Show me my recent calls"
> "Get the transcript for that last call"

## Scripts

| Script | Description |
|---|---|
| `scripts/send-email.ts` | Send an email |
| `scripts/list-emails.ts` | List inbox messages |
| `scripts/get-thread.ts` | Get a full email thread |
| `scripts/search-emails.ts` | Full-text search |
| `scripts/place-call.ts` | Place an outbound phone call |
| `scripts/list-calls.ts` | List call history |
| `scripts/get-transcript.ts` | Get a call transcript |

### Manual testing

```bash
export INKBOX_API_KEY=ApiKey_...
export INKBOX_AGENT_HANDLE=my-agent

# List last 10 emails
npx tsx scripts/list-emails.ts --limit 10

# List unread only
npx tsx scripts/list-emails.ts --unread

# Send an email
npx tsx scripts/send-email.ts \
  --to alice@example.com \
  --subject "Hello" \
  --body "Hi Alice, just checking in."

# Reply to a message
npx tsx scripts/send-email.ts \
  --to alice@example.com \
  --subject "Re: Hello" \
  --body "Thanks for your reply!" \
  --replyTo <message-id>

# Get a thread
npx tsx scripts/get-thread.ts --threadId <thread-id>

# Search
npx tsx scripts/search-emails.ts --query "invoice" --limit 5

# Place a call
npx tsx scripts/place-call.ts --to +15551234567

# Place a call with a WebSocket audio bridge
npx tsx scripts/place-call.ts --to +15551234567 --clientWebsocketUrl wss://your-server/audio

# List call history
npx tsx scripts/list-calls.ts --limit 5

# Get a transcript
npx tsx scripts/get-transcript.ts --callId <call-id>
```

## License

MIT
