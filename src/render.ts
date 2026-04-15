import type { UsageData } from './api.js';

// ── ANSI helpers ────────────────────────────────────────────────────────────

function hexToAnsi256(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  if (r === g && g === b) {
    if (r < 8) return 16;
    if (r > 248) return 231;
    return Math.round(((r - 8) / 247) * 24) + 232;
  }
  return 16 + 36 * Math.round((r / 255) * 5) + 6 * Math.round((g / 255) * 5) + Math.round((b / 255) * 5);
}

const R = '\x1b[0m';
const fg = (hex: string) => `\x1b[38;5;${hexToAnsi256(hex)}m`;
const bg = (hex: string) => `\x1b[48;5;${hexToAnsi256(hex)}m`;

// Powerline right-arrow  (Nerd Font U+E0B0)
const ARROW = '\uE0B0';

// ── Color palette ───────────────────────────────────────────────────────────

const BASE_BG   = '#1e1e2e';  // Catppuccin Mocha base
const MODEL_FG  = '#cba6f7';  // mauve
const BLOCK_FG  = '#89b4fa';  // blue
const WEEKLY_FG = '#a6e3a1';  // green
const CTX_FG    = '#f5c2e7';  // pink

const WARN_BG   = '#e08118';  // deep amber
const WARN_FG   = '#1e1e2e';
const CRIT_BG   = '#d20f39';  // red
const CRIT_FG   = '#ffffff';

// ── Segment ─────────────────────────────────────────────────────────────────

interface Seg {
  bgHex: string;
  fgHex: string;
  text: string;
}

function colorsForPercent(pct: number, normalFg: string): { bgHex: string; fgHex: string } {
  if (pct >= 90) return { bgHex: CRIT_BG, fgHex: CRIT_FG };
  if (pct >= 70) return { bgHex: WARN_BG, fgHex: WARN_FG };
  return { bgHex: BASE_BG, fgHex: normalFg };
}

// ── Time formatting ─────────────────────────────────────────────────────────

function fmtResetTime(d: Date): string {
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const h12 = h % 12 || 12;
  const ampm = h < 12 ? 'am' : 'pm';
  return `${h12}:${m}${ampm}`;
}

// ── Powerline render ─────────────────────────────────────────────────────────

function renderPowerline(segs: Seg[]): string {
  if (segs.length === 0) return '';
  let out = '';
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    const next = segs[i + 1];
    out += bg(s.bgHex) + fg(s.fgHex) + s.text + R;
    if (next) {
      out += fg(s.bgHex) + bg(next.bgHex) + ARROW;
    } else {
      out += fg(s.bgHex) + ARROW + R;
    }
  }
  return out;
}

// ── Main render ──────────────────────────────────────────────────────────────

export interface RenderInput {
  modelName: string | null;
  usage: UsageData | null;
  contextPct: number;
}

export function render(input: RenderInput): string {
  const compact = (process.stdout.columns ?? 120) < 80;
  const segs: Seg[] = [];

  // ── Model
  if (input.modelName) {
    segs.push({
      bgHex: BASE_BG,
      fgHex: MODEL_FG,
      text: ` \u2731 ${input.modelName} `,   // ✱
    });
  }

  // ── 5-hour block
  const fh = input.usage?.fiveHour;
  if (fh !== undefined) {
    const pct = fh?.percent ?? null;
    const { bgHex, fgHex } = pct !== null ? colorsForPercent(pct, BLOCK_FG) : { bgHex: BASE_BG, fgHex: BLOCK_FG };
    let text: string;
    if (pct === null) {
      text = ' \u25EB -- ';  // ◫
    } else {
      const timeStr = (!compact && fh?.resetsAt) ? ` \u2192 ${fmtResetTime(fh.resetsAt)}` : '';
      text = ` \u25EB ${pct}%${timeStr} `;
    }
    segs.push({ bgHex, fgHex, text });
  }

  // ── Weekly
  const sw = input.usage?.sevenDay;
  if (sw !== undefined) {
    const pct = sw?.percent ?? null;
    const { bgHex, fgHex } = pct !== null ? colorsForPercent(pct, WEEKLY_FG) : { bgHex: BASE_BG, fgHex: WEEKLY_FG };
    const text = pct === null ? ' \u25CB -- ' : ` \u25CB ${pct}% `;  // ○
    segs.push({ bgHex, fgHex, text });
  }

  // ── Context
  const ctxPct = input.contextPct;
  const ctxColors = colorsForPercent(ctxPct, CTX_FG);
  segs.push({
    bgHex: ctxColors.bgHex,
    fgHex: ctxColors.fgHex,
    text: ` \u25D0 ${ctxPct}% `,  // ◐
  });

  return renderPowerline(segs);
}
