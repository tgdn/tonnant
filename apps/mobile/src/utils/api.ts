import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@tonnant/trpc";

/**
 * A set of typesafe hooks for consuming your API.
 */
export const api = createTRPCReact<AppRouter>();
export { type RouterInputs, type RouterOutputs } from "@tonnant/trpc";
