import { ShowcaseRecord } from './types';

export function buildPenUrl(record: Pick<ShowcaseRecord, 'pen_user' | 'pen_slug'>): string {
  return `https://codepen.io/${record.pen_user}/pen/${record.pen_slug}`;
}
