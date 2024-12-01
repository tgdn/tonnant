import "./lib/sentry";

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { TransactionCanceledException } from "@aws-sdk/client-dynamodb";
import * as Sentry from "@sentry/aws-serverless";
import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";

// import { flushEvents } from "@tonnant/backend-utils/analytics";
import { appRouter, createAwsTrpcContext } from "@tonnant/trpc";

export const handler = Sentry.wrapHandler(
  async (
    event: APIGatewayProxyEvent,
    context,
  ): Promise<APIGatewayProxyResult> => {
    const response = await trpcHandler(event, context);
    // await flushEvents();
    return response;
  },
);

const trpcHandler = awsLambdaRequestHandler({
  router: appRouter,
  createContext: createAwsTrpcContext,
  responseMeta() {
    return {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Request-Method": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": "true",
      },
    };
  },
  onError({ error, path, ctx, input }) {
    console.error(`>>> tRPC Error on '${path}'`, error);
    if (error.cause instanceof TransactionCanceledException) {
      console.log("CancellationReasons:", error.cause.CancellationReasons);
    }
    // TODO: add Sentry
    // Sentry.captureException(error, {
    //   user: {
    //     userId: ctx?.userId,
    //     userEmail: ctx?.userEmail,
    //     clerkId: ctx?.clerkId,
    //   },
    //   extra: {
    //     input,
    //   },
    //   tags: {
    //     type: "trpc",
    //   },
    // });
  },
});
