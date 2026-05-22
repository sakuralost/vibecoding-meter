# vibecoding-meter: Codex branch

This branch contains **Codex Meter**, the Codex CLI companion in the `vibecoding-meter` repository.

`vibecoding-meter` keeps provider-specific meters in separate branches:

| Branch | Tool | Purpose |
|--------|------|---------|
| [`claude`](https://github.com/sakuralost/vibecoding-meter/tree/claude) | `claude-meter` | Claude Code statusline for model, quota windows, and context usage |
| [`codex`](https://github.com/sakuralost/vibecoding-meter/tree/codex) | `codex-meter` | Codex CLI meter for model, 5-hour quota, weekly quota, and context usage |

It renders:

```text
✱ GPT-5.5 > ◫ 5h used 2% → 5:23pm > ○ week used 0% > ◐ ctx used 31%
```

The script reads Codex's local session telemetry from `~/.codex/sessions/**/*.jsonl`. It does not call private APIs or print credentials.

## Usage

```bash
meter
codex-meter
~/plugins/codex-meter/scripts/codex-meter
~/plugins/codex-meter/scripts/codex-meter --verbose
~/plugins/codex-meter/scripts/codex-meter --no-color
```

## Repository install

```bash
git clone -b codex https://github.com/sakuralost/vibecoding-meter.git ~/plugins/codex-meter
ln -sf ~/plugins/codex-meter/scripts/codex-meter ~/.local/bin/codex-meter
```

If you already have the local plugin folder, pull this branch from inside `~/plugins/codex-meter`.

Codex CLI v0.128.0 does not currently support custom slash commands. The plugin ships a Codex skill so asking for "codex meter" in Codex can trigger the same local script, while the shell commands above provide the instant one-line meter.

## Notes

Codex currently emits the relevant rate limit telemetry into session logs. `primary` is the 300-minute window, `secondary` is the 10080-minute window, and `ctx used` is the latest request input tokens divided by the model context window for the current session.
