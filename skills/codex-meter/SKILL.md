---
name: codex-meter
description: Show the current Codex usage meter, including model, 5-hour quota, weekly quota, and context usage. Use when the user asks for codex meter, usage meter, quota, rate limit, context usage, or current Codex usage.
---

# Codex Meter

Run the local meter script and report its compact status line.

## Command

```bash
codex-meter --verbose
```

## Rules

- Do not read or print secrets from `~/.codex/auth.json`.
- Prefer the `codex-meter` executable on PATH.
- If `codex-meter` is unavailable, run `~/plugins/codex-meter/scripts/codex-meter --verbose`.
- Return the status line and the session path from verbose output.
- If no telemetry exists yet, explain that Codex will populate it after the next model response.
