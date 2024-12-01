import { recordingRouter } from "./router/recording";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  recording: recordingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
