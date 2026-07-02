// Compatibility shim — the data layer now lives in store.ts (pure-JS, file-backed).
export { getData, persist, nextId, logActivity, now, today } from "./store";
