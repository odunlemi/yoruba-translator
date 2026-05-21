import { useRef } from "react";
import {
  useAudioRecorder,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  RecordingPresets,
} from "expo-audio";
import { AppStatus } from "../../App";

const ASSEMBLYAI_API_KEY = process.env.EXPO_PUBLIC_ASSEMBLYAI_KEY!;
const WS_URL = `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${ASSEMBLYAI_API_KEY}`;

export function useRecording({
  setStatus,
  setEnglish,
}: {
  setStatus: (s: AppStatus) => void;
  setEnglish: (t: string) => void;
}) {
  const wsRef = useRef<WebSocket | null>(null);
  const transcriptRef = useRef("");
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const startRecording = async () => {
    const permission = await requestRecordingPermissionsAsync();
    if (!permission.granted) {
      return;
    }

    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    });

    // Open AssemblyAI WebSocket
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    transcriptRef.current = "";

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.message_type === "FinalTranscript" && msg.text) {
        transcriptRef.current += " " + msg.text;
        setEnglish(transcriptRef.current.trim());
      }
    };

    await recorder.prepareToRecordAsync({
      ...RecordingPresets.HIGH_QUALITY,
      sampleRate: 16000,
      android: {
        ...RecordingPresets.HIGH_QUALITY.android,
        sampleRate: 16000,
      },
      ios: {
        ...RecordingPresets.HIGH_QUALITY.ios,
        sampleRate: 16000,
      },
    });
    recorder.record();
    setStatus("recording");
  };

  const stopRecording = async (): Promise<string | null> => {
    setStatus("transcribing");
    await recorder.stop();
    wsRef.current?.close();
    return transcriptRef.current.trim() || null;
  };
  return { startRecording, stopRecording };
}
