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
  recordingDuration: [number, number, number];
  formattedRecordingDuration: string;
  startRecording: () => void;
  pauseRecording: () => void;
  stopRecording: () => void;
};

const RecordingContext = React.createContext<RecordingContextState>(
  {} as RecordingContextState,
);

export function RecordingProvider(props: { children: React.ReactNode }) {
  const router = useRouter();
  const { mutateAsync: getPresignedUrl } =
    api.recording.getPresignedUrl.useMutation();
  const [recordingStatus, setRecordingStatus] =
    React.useState<RecordingStatus>("idle");
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const intervalIdRef = React.useRef<NodeJS.Timeout | null>(null);
  const [recordingDuration, setRecordingDuration] = React.useState<
    [number, number, number]
  >([0, 0, 0]);
  const startRecording = async () => {
    const status = await AudioModule.requestRecordingPermissionsAsync();
    if (!status.granted) {
      Alert.alert("Permission to access microphone was denied");
      return;
    }
    // Handle storing recording duration
    audioRecorder.record();
    setRecordingStatus("recording");
    intervalIdRef.current = setInterval(() => {
      updateRecordingDuration();
    }, 500);
    updateRecordingDuration();
    console.log("Recording started");
  };
  const updateRecordingDuration = () => {
    const recordingDuration = audioRecorder.currentTime;
    console.log({ recordingDuration });
    setRecordingDuration(secondsToHms(recordingDuration));
  };
  const pauseRecording = () => {
    audioRecorder.pause();
    setRecordingStatus("paused");
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    console.log("Recording paused");
  };
  const stopRecording = async () => {
    router.push("/upload");
    await audioRecorder.stop();
    setRecordingStatus("idle");
    setRecordingDuration([0, 0, 0]);
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    const recordingUri = audioRecorder.uri;
    if (recordingUri) {
      await prepareRecordingForUpload(recordingUri);
      // TODO: add catch block and store error in SQLite for retry
    } else {
      console.error("No recording URI found");
    }
  };
  const prepareRecordingForUpload = async (recordingUri: string) => {
    const recordingFile = new File(recordingUri);
    const recordingFileExtensionWithDot = recordingFile.extension;
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
  const formattedRecordingDuration = formatRecordingDuration(recordingDuration);
  return (
    <RecordingContext.Provider
      value={{
        audioRecorder,
        recordingDuration,
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

function secondsToHms(timeInSeconds: number): [number, number, number] {
  timeInSeconds = Number(timeInSeconds);
  const h = Math.floor(timeInSeconds / 3600);
  const m = Math.floor((timeInSeconds % 3600) / 60);
  const s = Math.floor((timeInSeconds % 3600) % 60);
  return [h, m, s];
}

function formatRecordingDuration([hours, minutes, seconds]: [
  number,
  number,
  number,
]): string {
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
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
