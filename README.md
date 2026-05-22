# claude-meter

**English** | [中文](#中文说明)

---

A focused statusline for [Claude Code](https://claude.ai/code) that shows what actually matters: current model, 5-hour quota with reset time, weekly quota, and context usage — with color alerts that warn you before you run out.

## Preview

```
 ✱ Sonnet 4.6 ❯ ◫ 23% → 3:40pm ❯ ○ 3% ❯ ◐ 12%
```

**Color levels** (applied per-segment):

| Usage | Color | Meaning |
|-------|-------|---------|
| < 70% | Default | All good |
| 70–89% | 🟠 Amber | Getting high |
| ≥ 90% | 🔴 Red | Almost out |

## Segments

| Symbol | Segment | Description |
|--------|---------|-------------|
| `✱` | Model | Current Claude model (e.g. `Sonnet 4.6`, `Opus 4`) |
| `◫` | 5-hour quota | Usage % of your rolling 5-hour block + reset clock time |
| `○` | Weekly quota | Usage % of your 7-day allowance |
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

专为 [Claude Code](https://claude.ai/code) 设计的状态栏插件，聚焦于最核心的信息：当前模型、五小时配额（含重置时间）、周配额、上下文用量，并通过颜色变化提前预警。

### 效果预览

```
 ✱ Sonnet 4.6 ❯ ◫ 23% → 3:40pm ❯ ○ 3% ❯ ◐ 12%
```

**颜色说明**（每个段独立判断）：

| 用量 | 颜色 | 含义 |
|------|------|------|
| < 70% | 默认色 | 正常 |
| 70–89% | 🟠 橙色 | 偏高，留意 |
| ≥ 90% | 🔴 红色 | 快用完了 |

### 各段说明

| 符号 | 名称 | 含义 |
|------|------|------|
| `✱` | 模型 | 当前使用的 Claude 模型，如 `Sonnet 4.6`、`Opus 4` |
| `◫` | 五小时配额 | 滚动五小时块的用量百分比 + 重置时刻 |
| `○` | 周配额 | 七天周期配额的用量百分比 |
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
