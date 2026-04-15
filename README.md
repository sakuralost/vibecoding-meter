# claude-meter

A focused statusline for [Claude Code](https://claude.ai/code) that shows what actually matters: current model, 5-hour quota, weekly quota, and context usage — with color that warns you before you run out.

## Preview

```
 ✱ Sonnet 4.6 ❯ ◫ 23% → 3:40pm ❯ ○ 3% ❯ ◐ 12% 
```

**Color levels** (applied to any segment that exceeds the threshold):

| Usage | Color | Meaning |
|-------|-------|---------|
| < 70% | Default | All good |
| 70–89% | 🟠 Amber | Getting high, keep an eye on it |
| ≥ 90% | 🔴 Red | Almost out |

## What each segment shows

| Symbol | Segment | Description |
|--------|---------|-------------|
| `✱` | Model | Current Claude model (e.g. Sonnet 4.6, Opus 4) |
| `◫` | 5-hour quota | Usage % of your rolling 5-hour block, with reset time |
| `○` | Weekly quota | Usage % of your 7-day allowance |
| `◐` | Context | How full the current conversation context window is |

The reset time next to `◫` shows the absolute clock time when your 5-hour block refreshes (e.g. `→ 3:40pm`), which is easier to parse at a glance than a countdown.

## Requirements

- [Claude Code](https://claude.ai/code) CLI
- Node.js ≥ 18
- A Claude **Pro**, **Max**, or **Team** subscription
- A terminal with [Nerd Fonts](https://www.nerdfonts.com/) for the best look (falls back gracefully without)

## Installation

**1. Install the package:**

```bash
npm install -g claude-meter
```

**2. Add to Claude Code settings** (`~/.claude/settings.json`):

```json
{
  "statusLine": {
    "type": "command",
    "command": "claude-meter"
  }
}
```

That's it. The statusline updates automatically.

## Sync on `/usage` (optional)

By default usage data is cached for 15 minutes to avoid hammering the API on every keypress.
If you want the statusline to immediately reflect fresh data whenever you run Claude Code's built-in `/usage` command, add a hook:

```json
{
  "statusLine": {
    "type": "command",
    "command": "claude-meter"
  },
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "^\\/usage",
        "hooks": [
          {
            "type": "command",
            "command": "claude-meter --refresh &"
          }
        ]
      }
    ]
  }
}
```

The `--refresh` flag forces a silent background API call and updates the cache. The native `/usage` command is completely unaffected.

## How it works

Claude Code invokes `claude-meter` on every statusline refresh, piping in a JSON payload with the current model and context window usage. The quota data (5-hour and weekly) is fetched from the Claude API using your locally stored OAuth token and cached to `~/.claude/claude-meter-cache.json` for 15 minutes.

Supported platforms: **macOS** (Keychain), **Linux** (`secret-tool`), **Windows** (PowerShell credential store), with a file-based fallback (`~/.claude/.credentials.json`).

## Debug

```bash
CLAUDE_METER_DEBUG=true claude-meter
```

## License

MIT
