/**
 * @deprecated Prefer importing from `@/lib/db/index`.
 *
 * This compatibility module re-exports the modular DB services.
 */

export * from "./db/index";

import dbApi from "./db/index";

export const api = dbApi;

export default dbApi;
