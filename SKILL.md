---
name: inkbox
description: Send and receive emails via Inkbox agent mailboxes. Use when the user wants to check inbox messages, list unread email, view a thread, search mailbox contents, or draft/send an email through an Inkbox agent mailbox.
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

# Inkbox Email Skill

Use this skill when the user wants to send an email, read their inbox, view an email thread, or search through emails. All emails are sent and received through the Inkbox agent identity specified by `INKBOX_AGENT_HANDLE`.

## Requirements

- `INKBOX_API_KEY` — your Inkbox API key (from console.inkbox.ai)
- `INKBOX_AGENT_HANDLE` — the handle of the agent identity to use (e.g. `my-agent`)
- `node` must be installed (Node.js ≥ 18)

## Commands

### Send an email
```
npx tsx scripts/send-email.ts --to <address> --subject <subject> --body <text> [--cc <address>] [--bcc <address>] [--replyTo <messageId>]
```
- `--to` (required) — recipient email address
- `--subject` (required) — email subject line
- `--body` (required) — plain text email body
- `--cc` (optional) — CC recipient address
- `--bcc` (optional) — BCC recipient address
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

## Notes

- Always confirm with the user before sending an email.
- Use `list-emails.ts --unread` to check for new messages.
- Thread IDs are available in the `threadId` field of any message object.
- Message IDs from `list-emails` can be passed to `--replyTo` when replying.
