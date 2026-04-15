import fs from 'fs';
import path from 'path';
import os from 'os';
import { getOAuthToken } from './token.js';

const CACHE_FILE = path.join(os.homedir(), '.claude', 'claude-meter-cache.json');
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

function dbg(msg: string): void {
  if (process.env.CLAUDE_METER_DEBUG === 'true') process.stderr.write(`[meter] ${msg}\n`);
}

export interface UsageBlock {
  percent: number;   // 0–100
  resetsAt: Date;
}

export interface UsageData {
  fiveHour: UsageBlock | null;
  sevenDay: UsageBlock | null;
}

// ── Cache ──────────────────────────────────────────────────────────────────

interface CacheFile {
  timestamp: number;
  fiveHour: { percent: number; resetsAt: string } | null;
  sevenDay: { percent: number; resetsAt: string } | null;
}

function loadCache(): { data: UsageData; timestamp: number } | null {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    const raw = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8')) as CacheFile;
    const lift = (b: CacheFile['fiveHour']): UsageBlock | null =>
      b ? { percent: b.percent, resetsAt: new Date(b.resetsAt) } : null;
    return { timestamp: raw.timestamp, data: { fiveHour: lift(raw.fiveHour), sevenDay: lift(raw.sevenDay) } };
  } catch {
    return null;
  }
}

function saveCache(data: UsageData): void {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const out: CacheFile = {
      timestamp: Date.now(),
      fiveHour: data.fiveHour ? { percent: data.fiveHour.percent, resetsAt: data.fiveHour.resetsAt.toISOString() } : null,
      sevenDay: data.sevenDay ? { percent: data.sevenDay.percent, resetsAt: data.sevenDay.resetsAt.toISOString() } : null,
    };
    fs.writeFileSync(CACHE_FILE, JSON.stringify(out));
  } catch { /* ignore */ }
}

// ── API ────────────────────────────────────────────────────────────────────

interface ApiBlock {
  utilization?: number;
  resets_at?: string;
}

interface ApiResponse {
  five_hour?: ApiBlock;
  seven_day?: ApiBlock;
  [key: string]: ApiBlock | undefined;
}

async function fetchFromAPI(token: string): Promise<UsageData | null> {
  try {
    const res = await fetch('https://api.anthropic.com/api/oauth/usage', {
      headers: {
        Authorization: `Bearer ${token}`,
        'anthropic-beta': 'oauth-2025-04-20',
        'Content-Type': 'application/json',
        'User-Agent': 'claude-meter/1.0.0',
      },
    });
    if (!res.ok) { dbg(`API ${res.status}: ${res.statusText}`); return null; }

    const body = (await res.json()) as ApiResponse;
    dbg(`API OK: ${JSON.stringify(body)}`);

    const parse = (b: ApiBlock | undefined): UsageBlock | null => {
      if (!b) return null;
      return {
        percent: Math.round(b.utilization ?? 0),
        resetsAt: b.resets_at ? new Date(b.resets_at) : new Date(),
      };
    };

    return { fiveHour: parse(body.five_hour), sevenDay: parse(body.seven_day) };
  } catch (e) {
    dbg(`Fetch failed: ${e}`);
    return null;
  }
}

// ── Public API ──────────────────────────────────────────────────────────────

let _cachedToken: string | null = null;

export async function getUsage(forceRefresh = false): Promise<UsageData | null> {
  if (!forceRefresh) {
    const cached = loadCache();
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      dbg(`Cache hit (age ${Math.round((Date.now() - cached.timestamp) / 1000)}s)`);
      return cached.data;
    }
  }

  if (!_cachedToken) _cachedToken = await getOAuthToken();
  if (!_cachedToken) { dbg('No OAuth token'); return loadCache()?.data ?? null; }

  const data = await fetchFromAPI(_cachedToken);
  if (data) {
    saveCache(data);
    dbg('Cache refreshed');
    return data;
  }

  // Token may be stale — clear it and fall back to stale cache
  _cachedToken = null;
  return loadCache()?.data ?? null;
}
