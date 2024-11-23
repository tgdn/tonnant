import type { Config } from "jest";

const config: Config = {
  verbose: true,
  projects: [
    // "<rootDir>",
    {
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/apps/mobile/$1",
      },
      displayName: "mobile",
      preset: "jest-expo",
      testMatch: ["<rootDir>/apps/mobile/**/*.{spec,test}.{js,ts,tsx}"],
    },
  ],
};

export default config;
