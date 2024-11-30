import * as React from "react";
import { Alert } from "react-native";
import {
  AudioModule,
  RecordingPresets,
  useAudioRecorder,
  type AudioRecorder,
} from "expo-audio";

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
    await audioRecorder.stop();
    setRecordingStatus("idle");
    setRecordingDuration([0, 0, 0]);
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    const uri = audioRecorder.uri;
    // TODO: handle saving and uploading the recording in the background
    console.log("Recording stopped and stored at", uri);
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

export function useRecordingContext() {
  const recordingContext = React.useContext(RecordingContext);
  if (!recordingContext) {
    throw new Error(
      "useRecordingContext must be used within a RecordingProvider",
    );
  }
  return recordingContext;
}
