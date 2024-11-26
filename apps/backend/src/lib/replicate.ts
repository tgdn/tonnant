import Replicate from "replicate";

export const replicate = new Replicate();

export const models = {
  "victor-upmeet/whisperx": {
    modelId:
      "victor-upmeet/whisperx:84d2ad2d6194fe98a17d2b60bef1c7f910c46b2f6fd38996ca457afd9c8abfcb",
    defaultConfig: {
      debug: false,
      language: undefined,
      vad_onset: 0.684,
      vad_offset: 0.577,
      audio_file: undefined,
      batch_size: 64,
      diarization: true,
      temperature: 0,
      align_output: false,
      max_speakers: undefined,
      min_speakers: undefined,
      initial_prompt: undefined,
      huggingface_access_token: process.env.HF_TOKEN,
      language_detection_min_prob: 0,
      language_detection_max_tries: 5,
    } satisfies WhisperInputSchema,
  },
  "thomasmol/whisper-diarization": {
    modelId:
      "thomasmol/whisper-diarization:cbd15da9f839c5f932742f86ce7def3a03c22e2b4171d42823e83e314547003f",
    defaultConfig: {
      file: undefined,
      prompt: undefined,
      file_url: undefined,
      language: undefined,
      translate: false,
      file_string: undefined,
      num_speakers: undefined,
      group_segments: true,
      offset_seconds: 0,
      transcript_output_format: "both",
    } satisfies WhisperDiarizationInputSchema,
  },
} satisfies Record<
  string,
  {
    modelId: `${string}/${string}` | `${string}/${string}:${string}`;
    defaultConfig: Record<string, unknown>;
  }
>;

export type WhisperInputSchema = {
  /** Print out compute/inference times and memory usage information */
  debug?: boolean;
  /** ISO code of the language spoken in the audio, specify None to perform language detection */
  language?: string;
  /** Voice Activity Detection onset */
  vad_onset?: number;
  /** Audio file (URI format) */
  audio_file?: string | Buffer<ArrayBufferLike>;
  /** Parallelization of input audio transcription */
  batch_size?: number;
  /** Voice Activity Detection offset */
  vad_offset?: number;
  /** Assign speaker ID labels */
  diarization?: boolean;
  /** Temperature to use for sampling */
  temperature?: number;
  /** Aligns whisper output to get accurate word-level timestamps */
  align_output?: boolean;
  /** Maximum number of speakers if diarization is activated (leave blank if unknown) */
  max_speakers?: number;
  /** Minimum number of speakers if diarization is activated (leave blank if unknown) */
  min_speakers?: number;
  /** Optional text to provide as a prompt for the first window */
  initial_prompt?: string;
  /** HuggingFace token for diarization (requires user agreement acceptance) */
  huggingface_access_token?: string;
  /** Minimum probability for language detection */
  language_detection_min_prob?: number;
  /** Maximum retries for language detection */
  language_detection_max_tries?: number;
};

export type WhisperOutputSchema = {
  segments: unknown[];
  detected_language: string;
};

export type WhisperDiarizationInputSchema = {
  /**  Or an audio file (URI format) */
  file?: Buffer<ArrayBufferLike>;
  /**  Vocabulary: provide names, acronyms, and loanwords in a list. Use punctuation for best accuracy. */
  prompt?: string;
  /**  A direct audio file URL */
  file_url?: string;
  /**  Language of the spoken words as a language code like 'en'. Leave empty to auto-detect. */
  language?: string;
  /**  Translate the speech into English (default: false) */
  translate?: boolean;
  /**  Base64 encoded audio file */
  file_string?: string;
  /**  Number of speakers (1-50), leave empty to auto-detect */
  num_speakers?: number;
  /**  Group segments of the same speaker shorter apart than 2 seconds (default: true) */
  group_segments?: boolean;
  /**  Offset in seconds, used for chunked inputs (default: 0) */
  offset_seconds?: number;
  /**  Format of transcript output (default: "both") */
  transcript_output_format?: "words_only" | "segments_only" | "both";
};

export async function runReplicate<T extends object, S extends object>(
  identifier: `${string}/${string}` | `${string}/${string}:${string}`,
  input: T,
): Promise<S> {
  const output = await replicate.run(identifier, {
    input,
    wait: { mode: "poll" },
  });
  return output as S;
}
