import React from "react";
import { Text, StyleSheet } from "react-native";
import { AppStatus } from "../../App";

const STATUS_MAP: Record<AppStatus, { label: string; color: string }> = {
  idle: { label: "Tap to record", color: "#475569" },
  recording: { label: "Recording...", color: "#ef4444" },
  transcribing: { label: "Transcribing...", color: "#f59e0b" },
  translating: { label: "Translating to Yoruba...", color: "#f59e0b" },
  synthesising: { label: "Synthesising speech...", color: "#f59e0b" },
  ready: { label: "Ready", color: "#22c55e" },
  error: { label: "Something went wrong. Try again.", color: "#ef4444" },
};

export function StatusDisplay({ status }: { status: AppStatus }) {
  const { label, color } = STATUS_MAP[status];
  return <Text style={[styles.text, { color }]}>{label}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.3,
    textAlign: "center",
  },
});
