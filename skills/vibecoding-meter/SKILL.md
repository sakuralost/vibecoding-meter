---
name: vibecoding-meter
description: Work on the vibecoding-meter project, including the claude-meter and codex-meter branches, quota display semantics, README updates, local plugin sync, testing, and GitHub publishing.
---

# vibecoding-meter

Use this skill when modifying or explaining `sakuralost/vibecoding-meter`.

## Project Shape

- Repository: `https://github.com/sakuralost/vibecoding-meter`
- Local checkout: `~/claude-meter`
- Default branch: `claude`
- `claude` branch: npm package for Claude Code statusline integration.
- `codex` branch: Codex plugin/script layout with `.codex-plugin/`, `scripts/`, `commands/`, and `skills/`.
- Local installed Codex plugin mirror: `~/plugins/codex-meter`.

## Display Semantics

- Quota windows must display **remaining** percentage.
- Claude: API `utilization` is used percentage, so render quota as `100 - utilization`.
- Codex: telemetry `used_percent` is used percentage, so render quota as `100 - used_percent`.
- Context is not a quota window. Keep context as **used** percentage.
- Quota warning colors should trigger when remaining quota is low: `<= 30%` amber, `<= 10%` red.
- Context warning colors should trigger when usage is high: `>= 70%` amber, `>= 90%` red.

## Workflow

1. Check `git status --short --branch` before edits.
2. Edit the active branch only for its own implementation.
3. Keep README wording aligned with actual display semantics.
4. On `codex`, sync changes that affect the installed plugin to `~/plugins/codex-meter`.
5. Test before pushing.
6. Push branch updates to `origin`.

## Tests

Claude branch:

```bash
npm ci
npm run build
```

Run a smoke test with a temporary Claude cache and hook JSON. Confirm used quota `23%`/`3%` renders as remaining `77%`/`97%`.

Codex branch:

```bash
node -c scripts/codex-meter
scripts/codex-meter --no-color --verbose
```

For deterministic Codex testing, set `CODEX_HOME` to a temporary fixture with one session JSONL containing `rate_limits.primary.used_percent`, `rate_limits.secondary.used_percent`, and token counts. Confirm the output says `5h left` and `week left`.
