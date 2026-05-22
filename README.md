# Codex Meter

Codex Meter is a local Codex CLI companion to `claude-meter`.

It renders:

```text
 x GPT-5.5 > 5h used 2% -> 5:23pm > week used 0% > ctx used 31%
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

Codex CLI v0.128.0 does not currently support custom slash commands. The plugin ships a Codex skill so asking for "codex meter" in Codex can trigger the same local script, while the shell commands above provide the instant one-line meter.

## Notes

Codex currently emits the relevant rate limit telemetry into session logs. `primary` is the 300-minute window, `secondary` is the 10080-minute window, and `ctx used` is the latest request input tokens divided by the model context window for the current session.
