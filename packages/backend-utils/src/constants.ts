const IS_OFFLINE = process.env.IS_OFFLINE === "true";

export const RECORDINGS_BUCKET_NAME = IS_OFFLINE
  ? "api-dev-recordingsbucket304ae6cd-theifmhxnlqz"
  : process.env.RECORDINGS_BUCKET_NAME;
