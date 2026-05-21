import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

interface Props {
  lang: "EN" | "YO";
  text: string;
  visible: boolean;
  accent?: boolean;
}

export function TranslationCard({ lang, text, visible, accent }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Animated.View
      style={[styles.card, accent && styles.cardAccent, { opacity }]}
    >
      <Text style={styles.label}>{lang}</Text>
      <Text style={[styles.text, accent && styles.textAccent]}>
        {text ||
          (lang === "EN"
            ? "Your speech will appear here..."
            : "Yoruba translation will appear here...")}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e2030",
    borderRadius: 12,
    padding: 16,
    minHeight: 90,
    borderWidth: 1,
    borderColor: "#2a2d3a",
  },
  cardAccent: { backgroundColor: "#162032", borderColor: "#1e3a4a" },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#475569",
    marginBottom: 8,
  },
  text: { fontSize: 16, lineHeight: 26, color: "#94a3b8" },
  textAccent: { color: "#7dd3fc" },
});
