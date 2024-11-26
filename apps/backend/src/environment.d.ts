declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      REGION: string;
      AWS_ACCOUNT_ID: string;
      CLERK_WEBHOOK_SECRET: string;
      CLERK_SECRET_KEY: string;
      CLERK_PEM_PUBLIC_KEY: string;
      REPLICATE_API_TOKEN: string;
      HF_TOKEN: string;
      OPENAI_API_KEY: string;
    }
  }
}

export {};
