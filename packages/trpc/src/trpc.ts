/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */
import type { APIGatewayProxyEvent } from "aws-lambda";
import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import * as jwt from "jsonwebtoken";
import superjson from "superjson";
import { ZodError } from "zod";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    clerkId: string;
    userId: string;
    userEmail: string;
  }
}

const CLERK_PEM_PUBLIC_KEY = process.env.CLERK_PEM_PUBLIC_KEY!;
if (!CLERK_PEM_PUBLIC_KEY) throw new Error("Missing CLERK_PEM_PUBLIC_KEY");
// TODO: move this to shared constants
const BASE_APP_URL_PROD = "https://tonnant.com"; // Update this to be a link to the app

/**
 * Initialization
 * This is where the trpc api is initialized, connecting the context and transformer
 */
const t = initTRPC.context<typeof createAwsTrpcContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

export const createAwsTrpcContext = ({
  event,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEvent>) => {
  const source = event.headers?.["x-trpc-source"] ?? "unknown";
  const origin = event.headers?.Origin ?? BASE_APP_URL_PROD;
  // Headers are not lower cased
  const authorization =
    event.headers?.authorization ?? event.headers?.Authorization;
  const ipAddress = event.requestContext?.identity?.sourceIp;
  return createTrpcContextInternal(authorization, source, origin, ipAddress);
};

export function createTrpcContextInternal(
  authorization: string | null | undefined,
  source: string,
  origin: string,
  ipAddress: string | undefined,
) {
  const token = authorization?.split(" ")?.[1];
  const jwtPayload = decodeJwt(token);
  console.log(">>> tRPC Request from", source, "by", jwtPayload?.userId);
  // Set the user on Sentry as soon as we know who they are
  // Sentry.setUser({
  //   email: jwtPayload?.userEmail,
  //   id: jwtPayload?.userId,
  //   ip_address: ipAddress,
  // });
  return {
    clerkId: jwtPayload?.sub,
    userId: jwtPayload?.userId,
    userEmail: jwtPayload?.userEmail,
    ipAddress,
    origin,
  };
}

function decodeJwt(token: string | undefined): jwt.JwtPayload | undefined {
  if (!token) return undefined;
  try {
    const decoded = jwt.verify(token, CLERK_PEM_PUBLIC_KEY) as jwt.JwtPayload;
    return decoded;
  } catch (error) {
    console.log(`Error decoding JWT, error:`, error);
  }
  return undefined;
}

/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an articifial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();
  if (t._config.isDev) {
    // artificial delay in dev 100-500ms
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
  const result = await next();
  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.clerkId || !ctx.userId || !ctx.userEmail) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        // Infer the following as non nullable
        clerkId: ctx.clerkId,
        userId: ctx.userId,
        userEmail: ctx.userEmail,
      },
    });
  });
