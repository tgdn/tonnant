import * as React from "react";
import { Alert } from "react-native";
import {
  AudioModule,
  RecordingPresets,
  useAudioRecorder,
  type AudioRecorder,
} from "expo-audio";

export type RecordingContextState = {
  audioRecorder: AudioRecorder;
  startRecording: () => void;
  pauseRecording: () => void;
  stopRecording: () => void;
  recordingDuration: [number, number, number];
};

const RecordingContext = React.createContext<RecordingContextState>(
  {} as RecordingContextState,
);

export function RecordingProvider(props: { children: React.ReactNode }) {
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
    intervalIdRef.current = setInterval(() => {
      const recordingDuration = audioRecorder.currentTime;
      console.log({ recordingDuration });
      setRecordingDuration(secondsToHms(recordingDuration));
    }, 1000);
    audioRecorder.record();
    console.log("Recording started");
  };
  const pauseRecording = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    audioRecorder.pause();
    console.log("Recording paused");
  };
  const stopRecording = async () => {
    await audioRecorder.stop();
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    const uri = audioRecorder.uri;
    console.log("Recording stopped and stored at", uri);
  };
  return (
    <RecordingContext.Provider
      value={{
        audioRecorder,
        startRecording,
        pauseRecording,
        stopRecording,
        recordingDuration,
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

export function useRecordingContext() {
  const recordingContext = React.useContext(RecordingContext);
  if (!recordingContext) {
    throw new Error(
      "useRecordingContext must be used within a RecordingProvider",
    );
  }
  return recordingContext;
}
