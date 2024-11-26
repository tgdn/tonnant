import { spawnSync } from "child_process";

const files = [
  "/Users/tgdn/Downloads/recordings/new/Rolex.m4a",
  "/Users/tgdn/Downloads/recordings/new/SFR.m4a",
  "/Users/tgdn/Downloads/recordings/new/Orange.m4a",
];

const promises: ReturnType<typeof convertToWav | typeof convertToMp3>[] = [];
for (const file of files) {
  // promises.push(convertToWav(file));
  promises.push(convertToMp3(file));
}
await Promise.allSettled(promises);

function convertToWav(inputFile: string) {
  return new Promise((resolve) => {
    const outputFile = getOutputName(inputFile) + ".wav";
    console.log(`Converting ${inputFile} to ${outputFile}...`);
    //ffmpeg -i 111.mp3 -acodec pcm_s16le -ac 1 -ar 16000 out.wav
    spawnSync("ffmpeg", [
      "-i",
      inputFile,
      "-acodec",
      "pcm_s16le",
      "-ac",
      "1",
      "-ar",
      "16000",
      outputFile,
    ]);
    console.log(`Converting ${inputFile} to ${outputFile} done!`);
    resolve(1);
  });
}

function convertToMp3(inputFile: string) {
  return new Promise((resolve) => {
    const outputFile = getOutputName(inputFile) + ".mp3";
    console.log(`Converting ${inputFile} to ${outputFile}...`);
    // ffmpeg -i input.file -map 0:a:0 -b:a 96k output.mp3
    spawnSync("ffmpeg", [
      "-i",
      inputFile,
      "-map",
      "0:a:0",
      "-b:a",
      "96k",
      outputFile,
    ]);
    console.log(`Converting ${inputFile} to ${outputFile} done!`);
    resolve(1);
  });
}

function getOutputName(inputFile: string) {
  const basename = inputFile.split(/[\\/]/).pop();
  return `${basename?.split(".")[0] ?? randomString()}`;
}

function randomString(): string {
  return (Math.random() + 1).toString(36).substring(3);
}
