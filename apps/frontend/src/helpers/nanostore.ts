import { persistentAtom } from "@nanostores/persistent";

export const managePanel = persistentAtom<boolean>("managePanel", false, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const infoPanel = persistentAtom<boolean>("infoPanel", false, {
  encode: JSON.stringify,
  decode: JSON.parse,
});
