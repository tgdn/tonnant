import { string } from "dynamodb-toolbox/attributes";
import { Entity } from "dynamodb-toolbox/entity";
import { schema } from "dynamodb-toolbox/schema";
import { Table } from "dynamodb-toolbox/table";
import { prefix } from "dynamodb-toolbox/transformers/prefix";

import { documentClient } from "./dynamodb";

export const UsersTable = new Table({
  documentClient,
  name: "users",
  partitionKey: {
    name: "PK",
    type: "string",
  },
  sortKey: {
    name: "SK",
    type: "string",
  },
  indexes: {
    GSI1: {
      type: "global",
      partitionKey: {
        name: "GSI1PK",
        type: "string",
      },
      sortKey: {
        name: "GSI1SK",
        type: "string",
      },
    },
    GSI2: {
      type: "global",
      partitionKey: {
        name: "GSI2PK",
        type: "string",
      },
      sortKey: {
        name: "GSI2SK",
        type: "string",
      },
    },
  },
});

export const UserEntity = new Entity({
  name: "USER",
  table: UsersTable,
  schema: schema({
    userId: string().key().required(),
    email: string().required(),
    clerkId: string().required(),
    firstName: string().required(),
    lastName: string().required(),
    imageUrl: string(),
    // Since the variable is only used as a type, we must disable the eslint rule
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }).and((userSchema) => ({
    GSI1PK: string()
      .link<typeof userSchema>(({ email }) => email)
      .transform(prefix("EMAIL")),
    GSI1SK: string()
      .link<typeof userSchema>(({ email }) => email)
      .transform(prefix("EMAIL")),
    GSI2PK: string()
      .link<typeof userSchema>(({ clerkId }) => clerkId)
      .transform(prefix("CLERK")),
    GSI2SK: string()
      .link<typeof userSchema>(({ clerkId }) => clerkId)
      .transform(prefix("CLERK")),
  })),
  computeKey: ({ userId }) => ({
    PK: `USER#${userId}`,
    SK: `USER#${userId}`,
  }),
});
