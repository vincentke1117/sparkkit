import { ShowcaseRecord, SyncStatus } from './types';

export const mockShowcases: ShowcaseRecord[] = [];

export const mockStatus: SyncStatus = {
  version: '0.0.0',
  lastSyncedAt: new Date().toISOString(),
  totalIndexed: 0,
  cacheHitRate: null,
};
