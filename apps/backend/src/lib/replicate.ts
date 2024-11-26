import Replicate from "replicate";

import { ModelInputOutput, ModelName } from "./models";

export const replicate = new Replicate();

export async function runReplicate<K extends ModelName>(
  identifier: K,
  input: ModelInputOutput[K]["input"],
): Promise<ModelInputOutput[K]["output"]> {
  const output = await replicate.run(identifier, {
    input,
    wait: { mode: "poll" },
  });
  return output as ModelInputOutput[K]["output"];
}
