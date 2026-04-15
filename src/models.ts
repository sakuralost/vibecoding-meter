const MODEL_MAP: Record<string, string> = {
  // Claude 4.6 series
  'claude-opus-4-6': 'Opus 4.6',
  'claude-sonnet-4-6': 'Sonnet 4.6',
  // Claude 4.5 series
  'claude-opus-4-5': 'Opus 4.5',
  'claude-opus-4-5-20251101': 'Opus 4.5',
  'claude-sonnet-4-5': 'Sonnet 4.5',
  'claude-sonnet-4-5-20251022': 'Sonnet 4.5',
  'claude-haiku-4-5': 'Haiku 4.5',
  'claude-haiku-4-5-20251001': 'Haiku 4.5',
  // Claude 4 series
  'claude-opus-4': 'Opus 4',
  'claude-opus-4-20250514': 'Opus 4',
  'claude-sonnet-4': 'Sonnet 4',
  'claude-sonnet-4-20250514': 'Sonnet 4',
  // Claude 3.7 / 3.5 series
  'claude-3-7-sonnet-20250219': 'Sonnet 3.7',
  'claude-3-5-sonnet-20241022': 'Sonnet 3.5',
  'claude-3-5-sonnet-20240620': 'Sonnet 3.5',
  'claude-3-5-sonnet-latest': 'Sonnet 3.5',
  'claude-3-5-haiku-20241022': 'Haiku 3.5',
  // Claude 3 series
  'claude-3-opus-20240229': 'Opus 3',
  'claude-3-sonnet-20240229': 'Sonnet 3',
  'claude-3-haiku-20240307': 'Haiku 3',
};

export function formatModel(id: string, displayName?: string): string {
  // Try display name first — strip "Claude " prefix
  if (displayName) {
    const clean = displayName.replace(/^Claude\s+/i, '').trim();
    if (clean && clean.length <= 20) return clean;
  }

  // Exact match
  if (MODEL_MAP[id]) return MODEL_MAP[id];

  // Fuzzy match
  const lower = id.toLowerCase();
  if (lower.includes('opus')) {
    if (lower.includes('4-6') || lower.includes('4.6')) return 'Opus 4.6';
    if (lower.includes('4-5') || lower.includes('4.5')) return 'Opus 4.5';
    if (lower.includes('-4-') || lower.match(/-4$/)) return 'Opus 4';
    if (lower.includes('-3-') || lower.match(/-3$/)) return 'Opus 3';
    return 'Opus';
  }
  if (lower.includes('sonnet')) {
    if (lower.includes('4-6') || lower.includes('4.6')) return 'Sonnet 4.6';
    if (lower.includes('4-5') || lower.includes('4.5')) return 'Sonnet 4.5';
    if (lower.includes('-4-') || lower.match(/-4$/) || lower.includes('-4-2025')) return 'Sonnet 4';
    if (lower.includes('3-7') || lower.includes('3.7')) return 'Sonnet 3.7';
    if (lower.includes('3-5') || lower.includes('3.5')) return 'Sonnet 3.5';
    if (lower.includes('-3-') || lower.match(/-3$/)) return 'Sonnet 3';
    return 'Sonnet';
  }
  if (lower.includes('haiku')) {
    if (lower.includes('4-5') || lower.includes('4.5')) return 'Haiku 4.5';
    if (lower.includes('-3-') || lower.match(/-3$/)) return 'Haiku 3';
    return 'Haiku';
  }

  // Fallback: last 15 chars of ID
  return id.length > 15 ? '…' + id.slice(-14) : id;
}
