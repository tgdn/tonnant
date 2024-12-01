import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { RECORDINGS_BUCKET_NAME } from "@tonnant/backend-utils/constants";
import { getS3PresignedPutUrl } from "@tonnant/backend-utils/s3";

import { protectedProcedure } from "../trpc";

if (!RECORDINGS_BUCKET_NAME)
  throw new Error("RECORDINGS_BUCKET_NAME is required");

export const recordingRouter = {
  getPresignedUrl: protectedProcedure
    .input(
      z.object({
        objectKey: z.string(),
        contentType: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      console.log(
        `S3: Getting presigned URL for PUT object ${input.objectKey}`,
      );
      const presignedUrl = await getS3PresignedPutUrl(
        RECORDINGS_BUCKET_NAME,
        input.objectKey,
        input.contentType,
      );
      console.log(
        `S3: Getting presigned URL for PUT object ${input.objectKey} done`,
      );
      return presignedUrl;
    }),
} satisfies TRPCRouterRecord;
