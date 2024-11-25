// Require here to fail during build if env is missing
// import("./env.mjs");

const path = require("path");
const pkg = require(path.resolve("./package.json"));

const printInfoPlugin = {
  name: "refresh-server",
  setup(build) {
    build.onEnd((_result) => {
      console.log("Build end");
      console.log(build.initialOptions.entryPoints);
      if (build.initialOptions.incremental) {
        console.log(
          `refresh-server: Clearing Cache for ${build.initialOptions.entryPoints.join(
            ", ",
          )}...`,
        );
        // Remove all items from the cache (this will force node to reload all of the built artifacts)
        Object.keys(require.cache).forEach(function (key) {
          const resolvedPath = require.resolve(key);
          if (resolvedPath.includes(build.initialOptions.outdir)) {
            delete require.cache[key];
          }
        });
      }
    });
  },
};

console.log("Building for", process.env.NODE_ENV);
// FIXME: check this actually works
// let external = ["@aws-sdk/client-dynamodb", "@aws-sdk/lib-dynamodb"];
let external = [];
const plugins = [];
if (process.env.NODE_ENV !== "production") {
  plugins.push(printInfoPlugin);
  external = [
    "@aws-sdk",
    "aws-sdk",
    "@next",
    "react",
    "react-dom",
    "dynamodb-toolbox",
    // This part is important and makes sure we bundle local dependencies
    ...Object.keys(pkg.dependencies || {}).filter(
      (packageName) => !packageName.startsWith("@tonnant"),
    ),
    ...Object.keys(pkg.peerDependencies || {}),
  ];
} else if (process.env.NODE_ENV === "production") {
  // Install Sentry on production builds
  // TODO: Fix this
  // const { sentryEsbuildPlugin } = require("@sentry/esbuild-plugin");
  // plugins.push(
  //   sentryEsbuildPlugin({
  //     org: "awarn",
  //     project: "api-server",
  //     authToken: process.env.SENTRY_AUTH_TOKEN,
  //   }),
  // );
}

module.exports = () => ({
  keepOutputDirectory: true,
  format: "esm",
  target: "esnext",
  platform: "node",
  packager: "pnpm",
  loader: {
    ".node": "copy",
    ".js": "jsx",
    ".html": "text",
  },
  bundle: true,
  minify: process.env.NODE_ENV === "production",
  minifyWhitespace: process.env.NODE_ENV === "production",
  minifySyntax: process.env.NODE_ENV === "production",
  minifyIdentifiers: false,
  sourcemap: process.env.NODE_ENV === "production",
  plugins,
  external,
  exclude: ["aws-sdk", "@next"],
  keepNames: true,
  treeShaking: process.env.NODE_ENV === "production",
  outputFileExtension: ".mjs",
  banner: {
    js: `
// BANNER START
const require = (await import("node:module")).createRequire(import.meta.url);
const __filename = (await import("node:url")).fileURLToPath(import.meta.url);
const __dirname = (await import("node:path")).dirname(__filename);
// BANNER END
`,
  },
  watch: {
    pattern: [
      // "../../**/*.(js|ts)",
      "src/**/*.(js|ts)",
      "../../packages/api/src/**/*.(js|ts)",
      "../../packages/db/**/*.(js|ts)",
      "../../packages/shared/src/**/*.(js|ts)",
      "../../packages/backend-utils/src/**/*.(js|ts)",
    ],
    ignore: [
      "node_modules",
      ".turbo",
      ".esbuild",
      ".build",
      ".serverless",
      ".next",
      "**/apps/webapp/**",
      "**/packages/ui/**",
    ],
  },
});
