declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RECORDINGS_BUCKET_NAME: string;
      RECORDINGS_BUCKET_ARN: string;
    }
  }
}

export {};
