---
name: inkbox
description: Send and receive emails and phone calls via Inkbox agent identities. Use when the user wants to check inbox messages, list unread email, view a thread, search mailbox contents, draft/send an email, place an outbound phone call, list call history, or retrieve call transcripts through an Inkbox agent identity.
metadata:
  openclaw:
    emoji: "📬"
    homepage: "https://www.inkbox.ai"
    requires:
      env:
        - INKBOX_API_KEY
        - INKBOX_AGENT_HANDLE
      bins:
        - node
    primaryEnv: INKBOX_API_KEY
---

# Inkbox Skill

Use this skill when the user wants to send an email, read their inbox, view an email thread, search through emails, place a phone call, list call history, or read call transcripts. All operations go through the Inkbox agent identity specified by `INKBOX_AGENT_HANDLE`.

## Requirements

- `INKBOX_API_KEY` — your Inkbox API key (from console.inkbox.ai)
- `INKBOX_AGENT_HANDLE` — the handle of the agent identity to use (e.g. `my-agent`)
- `node` must be installed (Node.js ≥ 18)

## Commands

### Send an email
```
npx tsx scripts/send-email.ts --to <address> --subject <subject> --body <text> [--cc <address>] [--bcc <address>] [--replyTo <messageId>]
```
- `--to` (required) — recipient address(es), comma-separated
- `--subject` (required) — email subject line
- `--body` (required) — plain text email body
- `--cc` (optional) — CC recipient address(es), comma-separated
- `--bcc` (optional) — BCC recipient address(es), comma-separated
- `--replyTo` (optional) — message ID to reply in-thread

Outputs: JSON with the sent message details.

### List inbox emails
```
npx tsx scripts/list-emails.ts [--limit <n>] [--unread]
```
- `--limit` (optional, default 10) — number of emails to return
- `--unread` (optional flag) — only return unread emails

Outputs: JSON array of messages with id, subject, from, date, snippet.

### Get a full email thread
```
npx tsx scripts/get-thread.ts --threadId <id>
```
- `--threadId` (required) — thread ID (found in list-emails output)

Outputs: JSON with all messages in the thread.

### Search emails
```
npx tsx scripts/search-emails.ts --query <text> [--limit <n>]
```
- `--query` (required) — full-text search query
- `--limit` (optional, default 10) — max results to return

Outputs: JSON array of matching messages.

### Place a phone call
```
npx tsx scripts/place-call.ts --to <e164-number> [--clientWebsocketUrl <url>]
```
- `--to` (required) — E.164 destination number (e.g. `+15551234567`)
- `--clientWebsocketUrl` (optional) — WebSocket URL for real-time audio bridging

Outputs: JSON with the created call record and current rate limit info.

### List call history
```
npx tsx scripts/list-calls.ts [--limit <n>] [--offset <n>]
```
- `--limit` (optional, default 10) — max results to return
- `--offset` (optional, default 0) — pagination offset

Outputs: JSON array of call records with id, direction, status, start/end times.

### Get a call transcript
```
npx tsx scripts/get-transcript.ts --callId <id>
```
- `--callId` (required) — call ID (found in list-calls output)

Outputs: JSON array of transcript segments ordered by sequence number.

## Notes

- Always confirm with the user before sending an email or placing a call.
- Use `list-emails.ts --unread` to check for new messages.
- Thread IDs are available in the `threadId` field of any message object.
- Message IDs from `list-emails` can be passed to `--replyTo` when replying.
- Phone numbers must be in E.164 format (e.g. `+15551234567`).
- The agent identity must have a phone number assigned to use phone commands.
- Call IDs from `list-calls` can be passed to `get-transcript.ts`.
