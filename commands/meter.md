---
description: Show the current Codex model, 5-hour quota, weekly quota, and context usage.
---

# Codex Meter

Run the local meter script and report its output exactly enough for the user to see the status line.

Note: Codex CLI v0.128.0 does not currently register custom plugin slash commands from this file.

## Preflight

1. Confirm Node.js is available with `node --version`.
2. Confirm the script exists at `~/plugins/codex-meter/scripts/codex-meter`.
3. Do not print secrets from `~/.codex/auth.json`.

## Plan

Read Codex local telemetry only. The script uses the latest `~/.codex/sessions/**/*.jsonl` rollout and, when available, `~/.codex/state_5.sqlite` for the model name.

## Commands

```bash
~/plugins/codex-meter/scripts/codex-meter --verbose
```

## Verification

Confirm the output includes model, 5-hour quota, weekly quota, and context fields. If Codex has not emitted token telemetry yet, explain that the meter will populate after the next model response.

## Summary

Return the status line and the source session path from verbose output.

## Next Steps

Suggest using `~/plugins/codex-meter/scripts/codex-meter` directly from the shell for a compact one-line meter.
