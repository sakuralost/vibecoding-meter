import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

function dbg(msg: string): void {
  if (process.env.CLAUDE_METER_DEBUG === 'true') process.stderr.write(`[meter] ${msg}\n`);
}

function isOAuthToken(s: string): boolean {
  return s.startsWith('sk-ant-oat');
}

function extractFromCredentialJson(content: string): string | null {
  try {
    const data = JSON.parse(content);
    const token =
      data?.claudeAiOauth?.accessToken ??
      data?.oauth_token ??
      data?.token ??
      data?.accessToken;
    return token && isOAuthToken(token) ? token : null;
  } catch {
    return null;
  }
}

async function fromKeychain(): Promise<string | null> {
  // Discover the actual keychain service name (may have a suffix)
  let serviceNames = ['Claude Code-credentials'];
  try {
    const { stdout } = await execAsync(
      `security dump-keychain 2>/dev/null | grep -o '"Claude Code-credentials[^"]*"'`,
      { timeout: 3000 }
    );
    const found = stdout
      .trim()
      .split('\n')
      .map((s) => s.replace(/^"|"$/g, ''))
      .filter(Boolean)
      .sort((a, b) => b.length - a.length);
    if (found.length > 0) serviceNames = [...new Set([found[0], ...serviceNames])];
  } catch { /* ignore */ }

  for (const name of serviceNames) {
    try {
      const { stdout } = await execAsync(`security find-generic-password -s "${name}" -w`, { timeout: 3000 });
      const raw = stdout.trim();
      if (raw.startsWith('{')) {
        const token = extractFromCredentialJson(raw);
        if (token) { dbg(`Token found in Keychain (${name})`); return token; }
      }
      if (isOAuthToken(raw)) { dbg(`Token found in Keychain (${name})`); return raw; }
    } catch { /* ignore */ }
  }
  return null;
}

async function fromSecretTool(): Promise<string | null> {
  try {
    const { stdout } = await execAsync(`secret-tool lookup service "Claude Code"`, { timeout: 3000 });
    const token = stdout.trim();
    if (isOAuthToken(token)) { dbg('Token found via secret-tool'); return token; }
  } catch { /* ignore */ }
  return null;
}

async function fromPowerShell(): Promise<string | null> {
  try {
    const { stdout } = await execAsync(
      `powershell -Command "[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String((Get-StoredCredential -Target 'Claude Code' -AsCredentialObject).Password))"`,
      { timeout: 5000 }
    );
    const token = stdout.trim();
    if (isOAuthToken(token)) { dbg('Token found via PowerShell'); return token; }
  } catch { /* ignore */ }
  return null;
}

function fromFiles(): string | null {
  const candidates = [
    path.join(os.homedir(), '.claude', '.credentials.json'),
    path.join(os.homedir(), '.claude', 'credentials.json'),
    path.join(os.homedir(), '.config', 'claude-code', 'credentials.json'),
    ...(process.env.APPDATA ? [path.join(process.env.APPDATA, 'Claude Code', 'credentials.json')] : []),
    ...(process.env.LOCALAPPDATA ? [path.join(process.env.LOCALAPPDATA, 'Claude Code', 'credentials.json')] : []),
  ];
  for (const p of candidates) {
    try {
      if (!fs.existsSync(p)) continue;
      const token = extractFromCredentialJson(fs.readFileSync(p, 'utf-8'));
      if (token) { dbg(`Token found in ${p}`); return token; }
    } catch { /* ignore */ }
  }
  return null;
}

export async function getOAuthToken(): Promise<string | null> {
  dbg(`Platform: ${process.platform}`);
  switch (process.platform) {
    case 'darwin': return (await fromKeychain()) ?? fromFiles();
    case 'linux':  return (await fromSecretTool()) ?? fromFiles();
    case 'win32':  return (await fromPowerShell()) ?? fromFiles();
    default:       return fromFiles();
  }
}
