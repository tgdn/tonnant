// Run script with: pnpm run -w runscript [name-of-script]
async function main() {
  const command = process.argv[2];
  if (!command) {
    console.error("Please provide a command name.");
    process.exit(1);
  }
  console.log(`Running script ${command}`);
  let scriptMain: () => Promise<void> | undefined;
  try {
    scriptMain = await import(`./${command}`).then(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (module) => module.default as () => Promise<void> | undefined,
    );
  } catch (error) {
    console.error(`Error importing script ${command}`, error);
    process.exit(1);
  }
  if (typeof scriptMain === "function") {
    await scriptMain();
  } else {
    console.error(`Script ${command} does not have a default export function.`);
    process.exit(1);
  }
}

await main();

export {};
