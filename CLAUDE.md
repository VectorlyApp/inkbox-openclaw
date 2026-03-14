# inkbox-openclaw

An OpenClaw skill that gives agents email and phone capabilities via [Inkbox](https://www.inkbox.ai) — API-first communication infrastructure for AI agents.

## What this is

This directory is an OpenClaw skill. It follows the [OpenClaw skill format](https://docs.openclaw.ai/tools/skills): a `SKILL.md` manifest with YAML frontmatter and natural language instructions, plus TypeScript scripts the model invokes via CLI.

## Structure

```
SKILL.md              ← OpenClaw manifest + model instructions
package.json          ← @inkbox/sdk + tsx
tsconfig.json
scripts/
  send-email.ts       ← Send an email
  list-emails.ts      ← List inbox (all or unread)
  get-thread.ts       ← Get a full email thread
  search-emails.ts    ← Full-text search emails
  place-call.ts       ← Place an outbound phone call
  list-calls.ts       ← List call history
  get-transcript.ts   ← Get transcript for a call
```

## SDK

Uses `@inkbox/sdk` (TypeScript). Scripts are run with `tsx` (no build step needed).

Entry point pattern used across all scripts:

```ts
import { Inkbox } from "@inkbox/sdk";

const inkbox = new Inkbox({ apiKey: process.env.INKBOX_API_KEY! });
const identity = await inkbox.getIdentity(process.env.INKBOX_AGENT_HANDLE!);
```

Key SDK methods used:
- `identity.sendEmail({ to, subject, bodyText, cc, bcc, inReplyToMessageId })`
- `identity.iterEmails()` / `identity.iterUnreadEmails()` — async generators, paginated automatically
- `identity.getThread(threadId)` — returns full thread with all messages
- `inkbox.mailboxes.search(emailAddress, { q, limit })` — full-text search (requires `identity.mailbox.emailAddress`)
- `identity.placeCall({ toNumber })` — place outbound call from identity's phone number
- `identity.listCalls({ limit, offset })` — list call history for identity's phone number
- `identity.listTranscripts(callId)` — get transcript segments for a call

## Required env vars

| Variable | Description |
|---|---|
| `INKBOX_API_KEY` | Inkbox API key from [console.inkbox.ai](https://console.inkbox.ai) |
| `INKBOX_AGENT_HANDLE` | Handle of the agent identity to use (e.g. `my-agent`) |

The identity must already exist and have a mailbox linked. Create one via the Inkbox console or SDK before using this skill.

## Installing the skill in OpenClaw

```bash
npm install
cp -r . ~/.openclaw/skills/inkbox
```

## Running scripts directly (for testing)

```bash
export INKBOX_API_KEY=ApiKey_...
export INKBOX_AGENT_HANDLE=my-agent

npx tsx scripts/list-emails.ts --limit 5
npx tsx scripts/list-emails.ts --unread
npx tsx scripts/send-email.ts --to someone@example.com --subject "Hello" --body "Hi there"
npx tsx scripts/send-email.ts --to a@example.com,b@example.com --subject "Hello" --body "Hi there"
npx tsx scripts/get-thread.ts --threadId <thread-uuid>
npx tsx scripts/search-emails.ts --query "invoice" --limit 10
npx tsx scripts/place-call.ts --to +15551234567
npx tsx scripts/list-calls.ts --limit 5
npx tsx scripts/get-transcript.ts --callId <call-uuid>
```

## Extending this skill

- **Reply to a message**: use `--replyTo <messageId>` with `send-email.ts` — passes `inReplyToMessageId` to thread the reply
- **HTML emails**: extend `send-email.ts` to accept `--bodyHtml` and pass `bodyHtml` to `sendEmail()`
- **Attachments**: `sendEmail()` accepts `attachments: [{ filename, contentType, contentBase64 }]`
- **Mark as read**: `identity.markEmailsRead(messageIds)` — add a `mark-read.ts` script if needed
- **Outbound call webhooks**: pass `--webhookUrl` to `place-call.ts` for call lifecycle events (extend the script to accept this flag)
- **WebSocket audio bridge**: pass `--clientWebsocketUrl` to `place-call.ts` for real-time audio (extend the script to accept this flag)
