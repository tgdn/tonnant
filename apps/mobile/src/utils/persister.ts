import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

import { storage } from "@/storage";

const clientStorage = {
  setItem: (key: string, value: string | number | boolean | ArrayBuffer) => {
    storage.set(key, value);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value === undefined ? null : value;
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
};

export const clientPersister = createSyncStoragePersister({
  storage: clientStorage,
});
