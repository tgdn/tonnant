import { readFile, writeFile } from "node:fs/promises";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

import { defaultModelInput, ModelName } from "../src/lib/models";
import { runReplicate } from "../src/lib/replicate";

const openai = new OpenAI();

const filenames: string[] = [
  // "/Users/tgdn/Downloads/recordings/new/Rolex.m4a",
  // "/Users/tgdn/Downloads/recordings/new/SFR.m4a",
  // "/Users/tgdn/Downloads/recordings/new/Orange.m4a",
  "/Users/tgdn/Downloads/recordings/real-estate.mp4",
];
// const model: ModelName = "victor-upmeet/whisperx:84d2ad2d6194fe98a17d2b60bef1c7f910c46b2f6fd38996ca457afd9c8abfcb"
const model: ModelName =
  "thomasmol/whisper-diarization:cbd15da9f839c5f932742f86ce7def3a03c22e2b4171d42823e83e314547003f";

export default async function main() {
  const promises: ReturnType<typeof transcribeAndExtractData>[] = [];
  for (const filename of filenames) {
    promises.push(transcribeAndExtractData(filename));
  }
  const settledPromises = await Promise.allSettled(promises);
  for (const promise of settledPromises) {
    if (promise.status === "rejected") {
      console.error(promise.reason);
    }
  }
}

async function transcribeAndExtractData(filename: string) {
  console.log(`Reading file ${filename}...`);
  const audioFile = await readFile(filename);
  console.log(`Reading file ${filename} done!`);
  console.log("Running Whisper...");
  const output = await runReplicate(
    model,
    // {
    //   ...defaultModelInput[model],
    //   audio_file: audioFile,
    //   diarization: true,
    //   align_output: false,
    //   max_speakers: 2,
    //   min_speakers: 2,
    // },
    {
      ...defaultModelInput[model],
      file: audioFile,
      num_speakers: 2,
      group_segments: true,
      transcript_output_format: "both",
    },
  );
  console.log(output.segments?.[0]);
  console.log("Running Whisper done!");
  const basename = filename.split(/[\\/]/).pop();
  console.log(`Writing file ${basename}-raw.json...`);
  await writeFile(`${basename}-raw.json`, JSON.stringify(output, null, 2));
  console.log(`Writing file ${basename}-raw.json done!`);
  console.log("Running OpenAI...");
  // Only send the text and speaker to OpenAI
  const openAiOutput = await runOpenAi(
    output.segments.map((segment) => ({
      text: segment.text,
      speaker: segment.speaker,
    })),
  );
  console.log("Running OpenAI done!");
  if (openAiOutput) {
    console.log(`Writing file ${basename}-parsed.json...`);
    await writeFile(
      `${basename}-parsed.json`,
      JSON.stringify(openAiOutput.segments, null, 2),
    );
    console.log(`Writing file ${basename}-parsed.json...`);
  }
}

const Segments = z.object({
  segments: z.array(
    z.object({
      text: z.string(),
      speaker: z.string(),
    }),
  ),
});

async function runOpenAi(segments: unknown[]) {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an expert JSON parser and writer and understand transcribed conversations.",
      },
      {
        role: "user",
        content: `Given the following JSON file that represents the output of a transcription model in segments of a conversation in a shop between a "customer" and a "sales", can you fix the segments that have a missing speakers and label them accordingly:
        ${JSON.stringify(segments)}`,
      },
    ],
    response_format: zodResponseFormat(Segments, "event"),
  });
  return completion.choices[0]?.message?.parsed;
}
