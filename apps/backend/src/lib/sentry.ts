import * as Sentry from "@sentry/aws-serverless";

import { AWS_ENVIRONMENT } from "@tonnant/shared/constants";

console.log("Sentry is initialized ⚡️");

Sentry.init({
  environment: AWS_ENVIRONMENT,
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.NODE_ENV === "production",
});
