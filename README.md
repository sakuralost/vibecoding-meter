# vibecoding-meter

`vibecoding-meter` keeps lightweight status meters for coding assistants in separate branches.

| Branch | Tool | Purpose |
|--------|------|---------|
| [`claude`](https://github.com/sakuralost/vibecoding-meter/tree/claude) | `claude-meter` | Claude Code statusline for model, remaining quota windows, and context usage |
| [`codex`](https://github.com/sakuralost/vibecoding-meter/tree/codex) | `codex-meter` | Codex CLI meter for model, remaining 5-hour quota, remaining weekly quota, and context usage |

This is the default `claude` branch.

## claude-meter

**English** | [中文](#中文说明)

---

A focused statusline for [Claude Code](https://claude.ai/code) that shows what actually matters: current model, remaining 5-hour quota with reset time, remaining weekly quota, and context usage — with color alerts that warn you before you run out.

## Preview

```
 ✱ Sonnet 4.6 ❯ ◫ 77% → 3:40pm ❯ ○ 97% ❯ ◐ 12%
```

**Quota color levels** (applied to remaining 5-hour and weekly quota):

| Remaining | Color | Meaning |
|-----------|-------|---------|
| > 30% | Default | All good |
| 11-30% | 🟠 Amber | Getting low |
| ≤ 10% | 🔴 Red | Almost out |

Context still uses the opposite rule: high context usage warns at 70% and turns red at 90%.

## Segments

| Symbol | Segment | Description |
|--------|---------|-------------|
| `✱` | Model | Current Claude model (e.g. `Sonnet 4.6`, `Opus 4`) |
| `◫` | 5-hour quota | Remaining % of your rolling 5-hour block + reset clock time |
| `○` | Weekly quota | Remaining % of your 7-day allowance |
| `◐` | Context | How full the current conversation context window is |

The reset time shown next to `◫` is an **absolute clock time** (e.g. `→ 3:40pm`) rather than a countdown — easier to read at a glance.

## Requirements

- [Claude Code](https://claude.ai/code) CLI
- Node.js ≥ 18
- Claude **Pro**, **Max**, or **Team** subscription
- A terminal with [Nerd Fonts](https://www.nerdfonts.com/) for best results (degrades gracefully without)

## Installation

**1. Install:**

```bash
npm install -g sakuralost/vibecoding-meter#claude
```

**2. Add to `~/.claude/settings.json`:**

```json
{
  "statusLine": {
    "type": "command",
    "command": "claude-meter"
  }
}
```

Done. The statusline updates automatically on every prompt.

## Sync on `/usage` (optional)

Usage data is cached for 15 minutes by default. To get an immediate refresh whenever you run Claude Code's native `/usage` command, add a hook — it runs silently in the background and doesn't affect the native command at all:

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

## How it works

Claude Code pipes a JSON payload into `claude-meter` on every statusline render, containing the current model and context window state. Quota data is fetched from the Claude API using your locally stored OAuth token and cached at `~/.claude/claude-meter-cache.json`.

OAuth token sources by platform:

| Platform | Source |
|----------|--------|
| macOS | Keychain (`Claude Code-credentials`) |
| Linux | `secret-tool` |
| Windows | PowerShell credential store |
| Fallback | `~/.claude/.credentials.json` |

## Debug

```bash
CLAUDE_METER_DEBUG=true claude-meter
```

## Acknowledgements

This project was inspired by the excellent work of the Claude Code community, especially:

- [claude-limitline](https://github.com/tylergraydev/claude-limitline) by [@tylergraydev](https://github.com/tylergraydev) — a feature-rich statusline with themes, sparklines, and git integration that pioneered the pattern of using Claude Code's `statusLine` hook for real-time usage display. A great reference for understanding the hook API and OAuth token retrieval.
- [ClaudeCodeStatusLine](https://github.com/daniel3303/ClaudeCodeStatusLine) by [@daniel3303](https://github.com/daniel3303)
- [claude-usage-bar](https://github.com/mnapoli/claude-usage-bar) by [@mnapoli](https://github.com/mnapoli)

Thank you to everyone building tools around Claude Code — this ecosystem is what makes the tool so much more usable.

## License

MIT

---

## 中文说明

**[English](#claude-meter)** | 中文

---

`vibecoding-meter` 会按分支保存不同编程助手的用量状态栏工具。

| 分支 | 工具 | 用途 |
|------|------|------|
| [`claude`](https://github.com/sakuralost/vibecoding-meter/tree/claude) | `claude-meter` | Claude Code 的模型、剩余配额和上下文状态栏 |
| [`codex`](https://github.com/sakuralost/vibecoding-meter/tree/codex) | `codex-meter` | Codex CLI 的模型、五小时剩余配额、周剩余配额和上下文状态显示 |

当前是默认的 `claude` 分支。

专为 [Claude Code](https://claude.ai/code) 设计的状态栏插件，聚焦于最核心的信息：当前模型、五小时剩余配额（含重置时间）、周剩余配额、上下文用量，并通过颜色变化提前预警。

### 效果预览

```
 ✱ Sonnet 4.6 ❯ ◫ 77% → 3:40pm ❯ ○ 97% ❯ ◐ 12%
```

**配额颜色说明**（五小时和周配额都显示剩余百分比）：

| 剩余 | 颜色 | 含义 |
|------|------|------|
| > 30% | 默认色 | 正常 |
| 11-30% | 🟠 橙色 | 偏低，留意 |
| ≤ 10% | 🔴 红色 | 快用完了 |

上下文仍按占用率判断：70% 开始橙色预警，90% 变红。

### 各段说明

| 符号 | 名称 | 含义 |
|------|------|------|
| `✱` | 模型 | 当前使用的 Claude 模型，如 `Sonnet 4.6`、`Opus 4` |
| `◫` | 五小时配额 | 滚动五小时块的剩余百分比 + 重置时刻 |
| `○` | 周配额 | 七天周期配额的剩余百分比 |
| `◐` | 上下文 | 当前对话上下文窗口的占用百分比 |

`◫` 旁边显示的是**绝对时间**（如 `→ 3:40pm`），而非"还剩多少分钟"，一眼就能判断还有多久恢复。

### 环境要求

- [Claude Code](https://claude.ai/code) CLI
- Node.js ≥ 18
- Claude **Pro**、**Max** 或 **Team** 订阅
- 安装了 [Nerd Fonts](https://www.nerdfonts.com/) 的终端字体（不安装也能用，但图标会退化）

### 安装

**第一步：安装命令**

```bash
npm install -g sakuralost/vibecoding-meter#claude
```

**第二步：在 `~/.claude/settings.json` 中添加配置**

```json
{
  "statusLine": {
    "type": "command",
    "command": "claude-meter"
  }
}
```

完成。每次提示刷新时状态栏自动更新。

### 配合 `/usage` 命令实时同步（可选）

默认情况下用量数据缓存 15 分钟，以避免频繁请求 API。
如果希望每次执行 Claude Code 内置的 `/usage` 命令时立刻刷新状态栏，可以添加以下 hook 配置：

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

`--refresh` 会在后台静默刷新缓存，不产生任何输出，原生 `/usage` 功能完全不受影响。

### 工作原理

Claude Code 在每次状态栏渲染时将包含当前模型和上下文窗口信息的 JSON 通过 stdin 传入 `claude-meter`。配额数据通过本地存储的 OAuth token 从 Claude API 获取，并缓存在 `~/.claude/claude-meter-cache.json`（15 分钟有效期）。

各平台的 token 读取方式：

| 平台 | 来源 |
|------|------|
| macOS | Keychain（`Claude Code-credentials`） |
| Linux | `secret-tool` |
| Windows | PowerShell 凭据存储 |
| 回退 | `~/.claude/.credentials.json` |

### 调试

```bash
CLAUDE_METER_DEBUG=true claude-meter
```

### 致谢

感谢 Claude Code 社区的开发者们，正是他们的工作给了本项目极大的启发：

- [claude-limitline](https://github.com/tylergraydev/claude-limitline)（[@tylergraydev](https://github.com/tylergraydev)）——功能完善的状态栏工具，支持多主题、sparkline 历史、git 集成等，最早系统性地探索了 `statusLine` hook 与 OAuth 用量 API 的结合方式，是非常有价值的参考实现。
- [ClaudeCodeStatusLine](https://github.com/daniel3303/ClaudeCodeStatusLine)（[@daniel3303](https://github.com/daniel3303)）
- [claude-usage-bar](https://github.com/mnapoli/claude-usage-bar)（[@mnapoli](https://github.com/mnapoli)）

感谢所有为 Claude Code 生态贡献工具的开发者，正是这些努力让这个工具变得更好用。

### 许可证

MIT
