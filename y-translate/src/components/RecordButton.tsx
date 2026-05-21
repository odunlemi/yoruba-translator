import React, { useEffect, useRef } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  View,
} from "react-native";
import { AppStatus } from "../../App";

const PROCESSING = ["transcribing", "translating", "synthesising"];

export function RecordButton({
  status,
  onPress,
}: {
  status: AppStatus;
  onPress: () => void;
}) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status === "recording") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.15,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulse.stopAnimation();
      pulse.setValue(1);
    }
  }, [status]);

  const isProcessing = PROCESSING.includes(status);
  const isRecording = status === "recording";
  const btnColor = isRecording
    ? "#ef4444"
    : isProcessing
      ? "#1e2030"
      : "#22c55e";

  return (
    <Animated.View style={{ transform: [{ scale: pulse }] }}>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: btnColor }]}
        onPress={onPress}
        disabled={isProcessing}
        activeOpacity={0.8}
      >
        {isProcessing ? (
          <ActivityIndicator color="#94a3b8" size="large" />
        ) : (
          <View style={isRecording ? styles.stopIcon : styles.micIcon} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  micIcon: { width: 20, height: 28, borderRadius: 10, backgroundColor: "#fff" },
  stopIcon: { width: 22, height: 22, borderRadius: 4, backgroundColor: "#fff" },
});
