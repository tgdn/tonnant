import "./lib/sentry";

import * as crypto from "crypto";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";
// import { clerkClient } from "@clerk/clerk-sdk-node";
import * as Sentry from "@sentry/aws-serverless";

// import { UsersTable } from "@tonnant/db/users";

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
if (!CLERK_WEBHOOK_SECRET) throw new Error("Missing CLERK_WEBHOOK_SECRET");

// import {
//   flushEvents,
//   getPostHogClient,
//   trackEvent,
// } from "@awarn/backend-utils/analytics";
// import { createStripeCustomer } from "@awarn/backend-utils/stripe";
// import { DEFAULT_WORKSPACE_NAME } from "@awarn/shared/constants";
// import { nanoid } from "@awarn/shared/nanoid";
// import { sendWelcomeEmail } from "@watchr/api";
// import {
//   constructWorkspaceAndMembershipObjects,
//   Folder,
//   getUserIdFromClerkId,
//   User,
//   Workspace,
//   workspaceFoldersTable,
//   WorkspaceMembership,
// } from "@watchr/db";

// import { env } from "../env.mjs";

export const handler = Sentry.wrapHandler(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      if (!event.body) throw new Error("Missing webhook body");
      console.log("Clerk webhook received:", event.body);
      if (!checkIsValidSignature(event)) throw new Error("Invalid signature");
      const webhookInput = JSON.parse(event.body) as WebhookEvent;
      switch (webhookInput.type) {
        /**
         * Create user
         */
        case "user.created": {
          console.log("Clerk webhook, creating user ...");
          // TODO: implement
          // Extract user data from Clerk webhook
          // const {
          //   id: clerkId,
          //   first_name,
          //   last_name,
          //   image_url,
          //   two_factor_enabled,
          //   email_addresses,
          //   primary_email_address_id,
          // } = webhookInput.data;
          // // Make sure we have a primary email
          // const email = email_addresses?.find(
          //   ({ id }) => id === primary_email_address_id,
          // )?.email_address;
          // if (!email) throw new Error("No primary email defined");
          // // Generate user and workspace objects
          // const userId = crypto.randomUUID();
          // const user: User = {
          //   clerkId,
          //   email,
          //   userId,
          //   firstName: first_name,
          //   lastName: last_name,
          //   displayName: `${first_name} ${last_name}`,
          //   imageUrl: image_url,
          //   twoFactorEnabled: two_factor_enabled,
          // };
          // console.log(`Creating user:${userId} with clerkId:${clerkId}...`);
          // // TODO: create user
          // console.log(`Creating user:${userId} with clerkId:${clerkId} done`);
          // console.log(`Updating Clerk public user metadata...`);
          // await clerkClient.users.updateUserMetadata(clerkId, {
          //   publicMetadata: {
          //     userId,
          //   },
          // });
          // console.log(`Updating Clerk user metadata done`);
          // END TODO
          // Add events
          // const posthog = getPostHogClient();
          // trackEvent(userId, "user signed up", undefined, {
          //   setUserProperties: { email, clerkId },
          // });
          // await sendWelcomeEmail({ email, name: user.displayName });
          // posthog.alias({ distinctId: userId, alias: email });
          console.log(`Clerk webhook done`);
          break;
        }
        /**
         * Update user
         */
        case "user.updated": {
          // Extract user data from Clerk webhook
          const clerkId = webhookInput?.data?.id;
          if (!clerkId) throw new Error("Missing Clerk ID");
          // const {
          //   first_name,
          //   last_name,
          //   image_url,
          //   two_factor_enabled,
          //   email_addresses,
          //   primary_email_address_id,
          // } = webhookInput.data;
          // // Make sure we have a primary email
          // const email = email_addresses?.find(
          //   ({ id }) => id === primary_email_address_id,
          // )?.email_address;
          // if (!email) throw new Error("No primary email defined");
          // Fetch user ID from Clerk ID
          // TODO: implement
          // const userId = await getUserIdFromClerkId(clerkId);
          // if (!userId) {
          //   console.error(`User with clerkId:${clerkId} not found`);
          //   Sentry.captureMessage(`User with clerkId:${clerkId} not found`);
          //   break; // Cannot continue without a user
          // }
          // console.log(`Clerk webhook: Updating user with userId:${userId} ...`);
          // await User.update({
          //   userId,
          //   clerkId,
          //   email,
          //   firstName: first_name,
          //   lastName: last_name,
          //   displayName: `${first_name} ${last_name}`,
          //   imageUrl: image_url,
          //   twoFactorEnabled: two_factor_enabled,
          // });
          // console.log(
          //   `Clerk webhook: Updating user with userId:${userId} done`,
          // );
          // const posthog = getPostHogClient();
          // trackEvent(userId, "user updated account", undefined, {
          //   setUserProperties: { email },
          // });
          // posthog.alias({ distinctId: userId, alias: email });
          // console.log("Updating user done");
          break;
        }
        /**
         * Delete user
         */
        case "user.deleted": {
          console.log("Clerk webhook, deleting user ...");
          const clerkId = webhookInput.data?.id;
          if (!clerkId) {
            console.warn(`Undefined Clerk ID`);
            break;
          }
          // TODO: implement
          // const userId = await getUserIdFromClerkId(clerkId);
          // if (!userId) {
          //   console.log(`User with clerkId:${clerkId} could not be found`);
          //   break;
          // }
          // /*
          // What to delete:
          // - User
          // - User memerships
          // - User workspaces + folders
          // - Workspace integrations
          // - Workspace invitations
          // */
          // console.log(`Deleting user with userId:${userId}`);
          // await User.delete({ userId });
          // // TODO: delete all dangling resources: workspace, membership, folders, integrations, etc.
          // console.log(`Deleting user done`);
          // trackEvent(userId, "user deleted account", undefined, {
          //   setUserProperties: { isDeleted: true },
          // });
          break;
        }
        /**
         * CRUD session
         */
        // Do not track session events for now
        // case "session.created":
        // case "session.ended":
        // case "session.removed":
        // case "session.revoked": {
        //   const clerkId = webhookInput.data.user_id;
        //   const userId = await getUserIdFromClerkId(clerkId);
        //   if (userId) {
        //     trackEvent(
        //       userId,
        //       webhookInput.type === "session.created"
        //         ? "user session created"
        //         : webhookInput.type === "session.ended"
        //           ? "user session ended"
        //           : webhookInput.type === "session.removed"
        //             ? "user session removed"
        //             : "user session revoked",
        //     );
        //   } else {
        //     // Clerk may call this webhook while the user is being created, which is normal
        //     console.warn(
        //       `Clerk webhook: user not found for Clerk ID: ${clerkId}`,
        //     );
        //   }
        //   break;
        // }
      }
      return {
        statusCode: 200,
        body: "ok",
      };
    } catch (error: unknown) {
      console.log("Clerk webhook handler failed, reason:", error);
      throw error; // Make sure we are warned by this error - find a solution
    } finally {
      // await flushEvents();
    }
  },
);

/**
 * Verify that the request was sent by Clerk (through Svix)
 * Docs: https://docs.svix.com/receiving/verifying-payloads/how-manual
 * The signature comes in a list form delimited by spaces such as:
 * v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE= v1,bm9ldHUjKzFob2VudXRob2VodWUzMjRvdWVvdW9ldQo= v2,MzJsNDk4MzI0K2VvdSMjMTEjQEBAQDEyMzMzMzEyMwo=
 */
function checkIsValidSignature(event: APIGatewayProxyEvent): boolean {
  const svixId = event.headers["svix-id"] ?? "";
  const svixTimestamp = event.headers["svix-timestamp"] ?? "";
  const svixSignatureList = event.headers["svix-signature"] ?? "";
  const signedContent = `${svixId}.${svixTimestamp}.${event.body}`;
  const secretBytes = Buffer.from(CLERK_WEBHOOK_SECRET.split("_")[1], "base64");
  const computedSignature = crypto
    .createHmac("sha256", secretBytes)
    .update(signedContent)
    .digest("base64")
    .toString();
  // Unpack Svix signature list, for now we compare it to the first signature
  const svixSignature = svixSignatureList.split(" ")[0].split(",")[1];
  if (!svixSignature || !computedSignature) return false;
  return crypto.timingSafeEqual(
    Buffer.from(computedSignature),
    Buffer.from(svixSignature),
  );
}
