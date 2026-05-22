# vibecoding-meter

**English** | [中文](#中文说明)

`vibecoding-meter` is a small collection of terminal meters for coding assistants. It shows the model, remaining quota windows, and current context pressure directly where you are working.

The repository keeps each provider implementation in its own branch:

| Branch | Tool | Purpose |
|--------|------|---------|
| [`codex`](https://github.com/sakuralost/vibecoding-meter/tree/codex) | `codex-meter` | Codex CLI meter for model, remaining 5-hour quota, remaining weekly quota, and context usage |
| [`claude`](https://github.com/sakuralost/vibecoding-meter/tree/claude) | `claude-meter` | Claude Code statusline for model, remaining quota windows, and context usage |

Both meters use the same display rule:

| Segment | Meaning |
|---------|---------|
| `✱` | Current model |
| `◫` | Remaining 5-hour quota |
| `○` | Remaining weekly quota |
| `◐` | Context used |

Quota segments show **remaining** percentage. Context shows **used** percentage.

Quota colors warn when remaining allowance is low: amber at `<= 30%`, red at `<= 10%`. Context colors warn when usage is high: amber at `>= 70%`, red at `>= 90%`.

## Codex Meter

Codex Meter is the Codex CLI companion in this repository. It reads local Codex session telemetry and renders a compact status line:

```text
✱ GPT-5.5 > ◫ 5h left 98% → 5:23pm > ○ week left 100% > ◐ ctx used 31%
```

Install from the `codex` branch:

```bash
git clone -b codex https://github.com/sakuralost/vibecoding-meter.git ~/plugins/codex-meter
ln -sf ~/plugins/codex-meter/scripts/codex-meter ~/.local/bin/codex-meter
```

Run it from the shell:

```bash
codex-meter
codex-meter --verbose
codex-meter --no-color
```

How it works:

- Reads the latest `~/.codex/sessions/**/*.jsonl` rollout.
- Uses Codex `rate_limits.primary.used_percent` for the 300-minute window.
- Uses Codex `rate_limits.secondary.used_percent` for the 10080-minute weekly window.
- Displays quota as `100 - used_percent`.
- Displays context as latest request input tokens divided by model context window.
- Does not call private APIs or print credentials.
- Ships a Codex skill so asking for "codex meter" can trigger the same local script.

## Claude Meter

Claude Meter is the Claude Code statusline implementation in this repository. It renders:

```text
 ✱ Sonnet 4.6 ❯ ◫ 77% → 3:40pm ❯ ○ 97% ❯ ◐ 12%
```

This package is not published to the npm registry. Install it directly from the default `claude` branch on GitHub with the npm CLI:

```bash
npm install -g github:sakuralost/vibecoding-meter#claude
```

Add it to `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "claude-meter"
  }
}
```

How it works:

- Claude Code pipes model and context-window data to `claude-meter`.
- Quota data is fetched from Claude's OAuth usage endpoint with the local Claude Code token.
- API `utilization` is treated as used percentage and displayed as `100 - utilization`.
- Results are cached at `~/.claude/claude-meter-cache.json`.

Optional `/usage` refresh hook:

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

## Branch Notes

- Use the `codex` branch when installing or editing the Codex plugin layout: `.codex-plugin/`, `scripts/`, `commands/`, and `skills/`.
- Use the `claude` branch when editing the Node package source under `src/`.
- Keep README wording aligned with actual display semantics: quota is remaining, context is used.

## License

MIT

---

## 中文说明

`vibecoding-meter` 是一组给编程助手使用的终端用量状态显示工具。目标是在你写代码的位置直接看到当前模型、剩余额度窗口和上下文压力。

这个仓库按分支保存不同实现：

| 分支 | 工具 | 用途 |
|------|------|------|
| [`codex`](https://github.com/sakuralost/vibecoding-meter/tree/codex) | `codex-meter` | Codex CLI 的模型、五小时剩余额度、周剩余额度和上下文显示 |
| [`claude`](https://github.com/sakuralost/vibecoding-meter/tree/claude) | `claude-meter` | Claude Code 的模型、剩余额度和上下文状态栏 |

两个工具统一显示规则：

| 段落 | 含义 |
|------|------|
| `✱` | 当前模型 |
| `◫` | 五小时剩余额度 |
| `○` | 周剩余额度 |
| `◐` | 上下文已用比例 |

配额段显示**剩余百分比**，上下文显示**已用百分比**。

配额颜色按剩余额度预警：`<= 30%` 变橙色，`<= 10%` 变红色。上下文按已用比例预警：`>= 70%` 变橙色，`>= 90%` 变红色。

### Codex Meter

Codex Meter 是这个仓库里的 Codex CLI 伴随工具。它读取本地 Codex session telemetry，输出紧凑状态行：

```text
✱ GPT-5.5 > ◫ 5h left 98% → 5:23pm > ○ week left 100% > ◐ ctx used 31%
```

从 `codex` 分支安装：

```bash
git clone -b codex https://github.com/sakuralost/vibecoding-meter.git ~/plugins/codex-meter
ln -sf ~/plugins/codex-meter/scripts/codex-meter ~/.local/bin/codex-meter
```

常用命令：

```bash
codex-meter
codex-meter --verbose
codex-meter --no-color
```

工作方式：

- 读取最新的 `~/.codex/sessions/**/*.jsonl` rollout。
- `rate_limits.primary.used_percent` 对应 300 分钟窗口。
- `rate_limits.secondary.used_percent` 对应 10080 分钟周窗口。
- 配额显示为 `100 - used_percent`。
- 上下文显示为最近一次请求输入 token / 模型上下文窗口。
- 不调用私有 API，也不打印凭据。
- 仓库内带有 Codex skill，可以让 "codex meter" 这类请求触发同一个本地脚本。

### Claude Meter

Claude Meter 是 Claude Code 的 statusline 实现。效果：

```text
 ✱ Sonnet 4.6 ❯ ◫ 77% → 3:40pm ❯ ○ 97% ❯ ◐ 12%
```

这个包没有发布到 npm registry。这里是用 npm CLI 直接从 GitHub 的默认 `claude` 分支安装：

```bash
npm install -g github:sakuralost/vibecoding-meter#claude
```

写入 `~/.claude/settings.json`：

```json
{
  "statusLine": {
    "type": "command",
    "command": "claude-meter"
  }
}
```

工作方式：

- Claude Code 将模型和上下文窗口数据通过 stdin 传给 `claude-meter`。
- 配额数据用本地 Claude Code token 从 Claude OAuth usage endpoint 获取。
- API 返回的 `utilization` 按已用百分比处理，显示时转成 `100 - utilization`。
- 结果缓存在 `~/.claude/claude-meter-cache.json`。

### 分支说明

- 安装或维护 Codex 插件时使用 `codex` 分支。
- 修改 Claude Node 包源码时使用 `claude` 分支。
- README 和代码语义要保持一致：配额是剩余，上下文是已用。

### 许可证

MIT
