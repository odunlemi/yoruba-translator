import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import { Paths, File } from "expo-file-system";

export function AudioPlayer({ audioB64 }: { audioB64: string }) {
  const [sound, setSound] = useState<any>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return () => {
      sound?.pause();
    };
  }, [sound]);

  const play = async () => {
    try {
      await setAudioModeAsync({ playsInSilentMode: true });
      const audioFile = new File(Paths.cache, "yoruba_output.mp3");
      await audioFile.write(audioB64, { encoding: "base64" });
      const player = createAudioPlayer({
        uri: audioFile.uri,
      });
      setSound(player);
      setPlaying(true);
      player.play();

      // Listen for playback completion
      player.addListener("playbackStatusUpdate", (status: any) => {
        if (status.didJustFinish && !status.isLooping) {
          setPlaying(false);
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const stop = () => {
    sound?.pause();
    setPlaying(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>YORUBA AUDIO</Text>
      <TouchableOpacity style={styles.btn} onPress={playing ? stop : play}>
        <Text style={styles.btnText}>{playing ? "Stop" : "Play Yoruba"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#162032",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#1e3a4a",
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#475569",
    flex: 1,
  },
  btn: {
    backgroundColor: "#22c55e",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  btnText: { fontSize: 13, fontWeight: "600", color: "#fff" },
});
