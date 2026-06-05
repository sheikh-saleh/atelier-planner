import { Serwist } from "serwist";

declare global {
  // eslint-disable-next-line no-var
  var __SW_MANIFEST: Array<{ url: string; revision: string | null }>;
}

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST as any,
});

serwist.addEventListeners();
