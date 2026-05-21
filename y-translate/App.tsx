import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { RecordButton } from "./src/components/RecordButton";
import { StatusDisplay } from "./src/components/StatusDisplay";
import { TranslationCard } from "./src/components/TranslationCard";
import { AudioPlayer } from "./src/components/AudioPlayer";
import { HistoryList, HistoryItem } from "./src/components/HistoryList";
import { useRecording } from "./src/hooks/useRecording";
import { useTranslation } from "./src/hooks/useTranslation";
import { colors, spacing } from "./src/constants/theme";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

export type AppStatus =
  | "idle"
  | "recording"
  | "transcribing"
  | "translating"
  | "synthesising"
  | "ready"
  | "error";

function MainScreen() {
  const [status, setStatus] = useState<AppStatus>("idle");
  const [englishText, setEnglish] = useState("");
  const [yorubaText, setYoruba] = useState("");
  const [audioB64, setAudio] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const { startRecording, stopRecording } = useRecording({
    setStatus,
    setEnglish,
  });
  const { runPipeline } = useTranslation({
    setStatus,
    setYoruba,
    setAudio,
    onComplete: (en, yo, audio) => {
      setHistory((h) => [{ en, yo, audio, id: Date.now() }, ...h].slice(0, 5));
    },
  });

  const handleRecord = async () => {
    if (status === "recording") {
      const transcript = await stopRecording();
      if (transcript) await runPipeline(transcript);
    } else if (status === "idle" || status === "ready" || status === "error") {
      setEnglish("");
      setYoruba("");
      setAudio(null);
      await startRecording();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Language bar */}
      <View style={styles.langBar}>
        <Text style={styles.langLabel}>EN</Text>
        <Text style={styles.langArrow}>&rarr;</Text>
        <Text style={styles.langLabel}>YO</Text>
        <Text style={styles.langNote}>Standard Yoruba</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <TranslationCard lang="EN" text={englishText} visible={!!englishText} />
        <TranslationCard
          lang="YO"
          text={yorubaText}
          visible={!!yorubaText}
          accent
        />
        {audioB64 && <AudioPlayer audioB64={audioB64} />}
        <HistoryList
          items={history}
          onSelect={(item: HistoryItem): void => {
            setEnglish(item.en);
            setYoruba(item.yo);
            setAudio(item.audio);
            setStatus("ready");
          }}
        />
      </ScrollView>

      <View style={styles.controls}>
        <StatusDisplay status={status} />
        <RecordButton status={status} onPress={handleRecord} />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ConvexProvider client={convex}>
      <MainScreen />
      {/* <StatusBar style="light" /> */}
    </ConvexProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  langBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2d3a",
  },
  langLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#f1f5f9",
    letterSpacing: 1,
  },
  langArrow: { fontSize: 14, color: "#475569" },
  langNote: { fontSize: 11, color: "#475569", marginLeft: "auto" },
  scroll: { padding: 16, gap: 12, paddingBottom: 32 },
  controls: {
    padding: 20,
    paddingBottom: 32,
    alignItems: "center",
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: "#2a2d3a",
  },
});
