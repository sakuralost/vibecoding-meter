export interface HookData {
  model?: {
    id?: string;
    display_name?: string;
  };
  context_window?: {
    current_usage?: {
      input_tokens?: number;
      cache_creation_input_tokens?: number;
      cache_read_input_tokens?: number;
    };
    context_window_size?: number;
  };
}

export async function readHookData(): Promise<HookData | null> {
  if (process.stdin.isTTY) return null;

  try {
    const chunks: Buffer[] = [];
    const result = await Promise.race<string | null>([
      new Promise((resolve, reject) => {
        process.stdin.on('data', (chunk: Buffer) => chunks.push(chunk));
        process.stdin.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
        process.stdin.on('error', reject);
      }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 200)),
    ]);

    if (!result?.trim()) return null;
    return JSON.parse(result) as HookData;
  } catch {
    return null;
  }
}

export function getContextPercent(hook: HookData | null): number {
  const ctx = hook?.context_window;
  if (!ctx?.current_usage || !ctx.context_window_size) return 0;
  const u = ctx.current_usage;
  const used =
    (u.input_tokens ?? 0) +
    (u.cache_creation_input_tokens ?? 0) +
    (u.cache_read_input_tokens ?? 0);
  return Math.round((used / ctx.context_window_size) * 100);
}
