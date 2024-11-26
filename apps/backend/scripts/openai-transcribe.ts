import fs from "fs";
import { writeFile } from "node:fs/promises";
import OpenAI from "openai";

const openai = new OpenAI();
const filenames: string[] = [
  "/Users/tgdn/Downloads/recordings/new/Rolex.m4a",
  "/Users/tgdn/Downloads/recordings/new/SFR.m4a",
  "/Users/tgdn/Downloads/recordings/new/Orange.m4a",
];

export default async function main() {
  const promises: [string, ReturnType<typeof transcribe>][] = [];
  for (const filename of filenames) {
    promises.push([filename, transcribe(filename)]);
  }
  await Promise.allSettled(promises);
}

async function transcribe(filename: string) {
  console.log(`Transcribing file ${filename}...`);
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filename),
    model: "whisper-1",
  });
  console.log(`Transcribing file ${filename} done!`);
  const basename = filename.split(/[\\/]/).pop();
  console.log(`Writing file ${basename}-raw.json...`);
  await writeFile(
    `${basename}-raw.json`,
    JSON.stringify(transcription.text, null, 2),
  );
  console.log(`Writing file ${basename}-raw.json done!`);
}
