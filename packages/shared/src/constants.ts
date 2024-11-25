
// TODO: add
export const AWS_ACCOUNT_ID_PROD = "XXXXX";
export const AWS_ACCOUNT_ID_STAGING = "277707096952";
export const AWS_ENVIRONMENT: "production" | "staging" =
  process.env.AWS_ACCOUNT_ID === AWS_ACCOUNT_ID_PROD ? "production" : "staging";

// export const POSTHOG_DEVELOPMENT_API_KEY =
//   "phc_yhC58ZPmI849i40P3rvYjmtFbShq7M2bjM4j7QM8Fno";
// export const POSTHOG_PRODUCTION_API_KEY =
//   "phc_E7tB2iNpXzQp4fkTFP3GfcND4wcgkJZQuVVqC9vDZgC";

// const CF_BASE_URL = "https://dchx6a8qa5vce.cloudfront.net";

export const PUBLIC_APP_NAME = "Tonnant";

// export const BASE_APP_URL_PROD = "https://app.awarn.io";
// export const BASE_APP_URL_STAGING = "https://staging.app.awarn.io";
// export const DEFAULT_APP_DOMAIN_ORIGIN =
//   AWS_ENVIRONMENT === "production" ? BASE_APP_URL_PROD : BASE_APP_URL_STAGING;
