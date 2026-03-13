# inkbox-openclaw

An OpenClaw skill that gives agents email capabilities via [Inkbox](https://www.inkbox.ai) — API-first communication infrastructure for AI agents.

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
npx tsx scripts/get-thread.ts --threadId <thread-uuid>
npx tsx scripts/search-emails.ts --query "invoice" --limit 10
```

## Extending this skill

- **Reply to a message**: use `--replyTo <messageId>` with `send-email.ts` — passes `inReplyToMessageId` to thread the reply
- **HTML emails**: extend `send-email.ts` to accept `--bodyHtml` and pass `bodyHtml` to `sendEmail()`
- **Attachments**: `sendEmail()` accepts `attachments: [{ filename, contentType, contentBase64 }]`
- **Mark as read**: `identity.markEmailsRead(messageIds)` — add a `mark-read.ts` script if needed
- **Phone (future)**: `identity.placeCall()`, `identity.listCalls()`, `identity.listTranscripts()` — see the main inkbox README for full API
