declare global {
  interface ServiceWorkerGlobalScope {
    __SW_MANIFEST: Array<{
      url: string;
      revision: string | null;
    }>;
  }
}

export {};
