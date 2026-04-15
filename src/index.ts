import { readHookData, getContextPercent } from './hook.js';
import { getUsage } from './api.js';
import { formatModel } from './models.js';
import { render } from './render.js';

async function main(): Promise<void> {
  try {
    const args = process.argv.slice(2);
    const isRefresh = args.includes('--refresh');

    if (isRefresh) {
      // Silent background refresh — called when user triggers /usage
      await getUsage(true);
      process.exit(0);
    }

    const hook = await readHookData();
    const modelName = hook?.model?.id
      ? formatModel(hook.model.id, hook.model.display_name ?? undefined)
      : null;
    const contextPct = getContextPercent(hook);
    const usage = await getUsage(false);

    const out = render({ modelName, usage, contextPct });
    if (out) process.stdout.write(out);
  } catch {
    // Never crash the terminal
    process.exit(0);
  }
}

main();
