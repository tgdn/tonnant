import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import type { TranslateConfig } from "@aws-sdk/lib-dynamodb";

const isTest = process.env.JEST_WORKER_ID;

const marshallOptions = {
  convertEmptyValues: false,
  removeUndefinedValues: true,
} satisfies TranslateConfig["marshallOptions"];

const translateConfig: TranslateConfig = { marshallOptions };

export const documentClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    // logger: console,
    // logger: {
    //   debug: (...content) => content.map((c) => console.log(JSON.stringify(c))),
    //   error: (...content) => content.map((c) => console.log(JSON.stringify(c))),
    //   info: (...content) => content.map((c) => console.log(JSON.stringify(c))),
    //   warn: (...content) => content.map((c) => console.log(JSON.stringify(c))),
    // },
    ...(isTest && {
      endpoint: "http://localhost:8000",
      tls: false,
      region: "local-env",
      credentials: {
        accessKeyId: "fake",
        secretAccessKey: "fake",
      },
    }),
  }),
  translateConfig,
);
