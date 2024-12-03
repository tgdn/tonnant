import * as React from "react";
import { Alert } from "react-native";
import {
  AudioModule,
  RecordingPresets,
  useAudioRecorder,
  type AudioRecorder,
} from "expo-audio";
import { randomUUID } from "expo-crypto";
import * as FileSystem from "expo-file-system";
import { File } from "expo-file-system/next";
import { useRouter } from "expo-router";

import { api } from "@/utils/api";

type RecordingStatus = "idle" | "recording" | "paused";

export type RecordingContextState = {
  audioRecorder: AudioRecorder;
  recordingStatus: RecordingStatus;
  isIdle: boolean;
  isRecording: boolean;
  isPaused: boolean;
  /** Stored as an array of formatted hours, minutes, seconds, milliseconds */
  formattedRecordingDuration: [string, string, string, string];
  startRecording: () => void;
  pauseRecording: () => void;
  stopRecording: () => void;
};

const RecordingContext = React.createContext<RecordingContextState>(
  {} as RecordingContextState,
);

const INITIAL_RECORDING_DURATION: [string, string, string, string] = [
  "00",
  "00",
  "00",
  "00",
];
const UPDATE_RECORDING_DURATION_INTERVAL_IN_MS = 10;

export function RecordingProvider(props: { children: React.ReactNode }) {
  const router = useRouter();
  const { mutateAsync: getPresignedUrl } =
    api.recording.getPresignedUrl.useMutation();
  const [recordingStatus, setRecordingStatus] =
    React.useState<RecordingStatus>("idle");
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const intervalIdRef = React.useRef<NodeJS.Timeout | null>(null);
  const [formattedRecordingDuration, setFormattedRecordingDuration] =
    React.useState<[string, string, string, string]>(
      () => INITIAL_RECORDING_DURATION,
    );
  /** Starts an idle or a paused recording */
  const startRecording = async () => {
    const status = await AudioModule.requestRecordingPermissionsAsync();
    if (!status.granted) {
      Alert.alert("Permission to access microphone was denied");
      return;
    }
    audioRecorder.record();
    setRecordingStatus("recording");
    // Update recording duration on an interval
    intervalIdRef.current = setInterval(
      updateRecordingDuration,
      UPDATE_RECORDING_DURATION_INTERVAL_IN_MS,
    );
    updateRecordingDuration();
    console.log("Recording started");
  };
  /** Updates formatted duration */
  const updateRecordingDuration = () => {
    const recordingDuration = audioRecorder.currentTime;
    setFormattedRecordingDuration(
      formatRecordingDuration(secondsToHmsMs(recordingDuration)),
    );
  };
  /** Pauses recording and clears update interval */
  const pauseRecording = () => {
    audioRecorder.pause();
    setRecordingStatus("paused");
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    console.log("Recording paused");
  };
  /** Stops recording, resets states, clears update interval and uploads file to S3 */
  const stopRecording = async () => {
    await audioRecorder.stop();
    router.push("/upload");
    setRecordingStatus("idle");
    setFormattedRecordingDuration(INITIAL_RECORDING_DURATION);
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    const recordingUri = audioRecorder.uri;
    if (recordingUri) {
      await prepareRecordingForUpload(recordingUri);
      // TODO: add catch block and store error in SQLite for retry later in case of failure/network error
    } else {
      console.error("No recording URI found");
    }
  };
  const prepareRecordingForUpload = async (recordingUri: string) => {
    const recordingFile = new File(recordingUri);
    const recordingFileExtensionWithDot = recordingFile.extension;
    // Random UUID for unique file name
    const recordingFileName = `${randomUUID()}${recordingFileExtensionWithDot}`;
    console.log("Recording stopped and stored at", recordingUri);
    console.log("Getting presigned URL...");
    const presignedUrl = await getPresignedUrl({
      objectKey: recordingFileName,
      contentType: "audio/mp4",
    });
    console.log("Getting presigned URL done");
    console.log("Uploading recording...");
    await uploadRecording(recordingUri, presignedUrl);
    console.log("Uploading recording done");
  };
  const uploadRecording = async (
    recordingUri: string,
    presignedUrl: string,
  ) => {
    const onProgressCallback = (progress: number) => {
      console.log("upload progress:", progress);
    };
    await uploadFile(recordingUri, presignedUrl, onProgressCallback);
  };
  return (
    <RecordingContext.Provider
      value={{
        audioRecorder,
        formattedRecordingDuration,
        recordingStatus,
        isRecording: recordingStatus === "recording",
        isPaused: recordingStatus === "paused",
        isIdle: recordingStatus === "idle",
        startRecording,
        pauseRecording,
        stopRecording,
      }}
    >
      {props.children}
    </RecordingContext.Provider>
  );
}

function secondsToHmsMs(
  timeInSeconds: number,
): [number, number, number, number] {
  timeInSeconds = Number(timeInSeconds);
  const h = Math.floor(timeInSeconds / 3600);
  const m = Math.floor((timeInSeconds % 3600) / 60);
  const s = Math.floor((timeInSeconds % 3600) % 60);
  const milliseconds = Math.floor((timeInSeconds % 1) * 1000);
  // Convert milliseconds to tenth of a second: 343ms = 34
  const tenthOfSecond = Math.floor(milliseconds / 10);
  return [h, m, s, tenthOfSecond];
}

function formatRecordingDuration([hours, minutes, seconds, milliseconds]: [
  number,
  number,
  number,
  number,
]): [string, string, string, string] {
  return [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
    String(milliseconds).padStart(2, "0"),
  ];
}

async function uploadFile(
  recordingUri: string,
  presignedUrl: string,
  onProgressCallback: (progress: number) => void,
) {
  const uploadTask = new FileSystem.UploadTask(
    presignedUrl,
    recordingUri,
    {
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      httpMethod: "PUT",
    },
    (event) => {
      console.log({
        totalBytesSent: event.totalBytesSent,
        totalBytesExpectedToSend: event.totalBytesExpectedToSend,
      });
      onProgressCallback(event.totalBytesSent / event.totalBytesExpectedToSend);
    },
  );
  console.log("Uploading recording...");
  // TODO: handle cancellation
  const result = await uploadTask.uploadAsync();
  console.log("Uploading recording done");
  console.log(result);
}

export function useRecordingContext() {
  const recordingContext = React.useContext(RecordingContext);
  if (!recordingContext) {
    throw new Error(
      "useRecordingContext must be used within a RecordingProvider",
    );
  }
  return recordingContext;
}
