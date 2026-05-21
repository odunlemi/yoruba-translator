import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

export interface HistoryItem {
  id: number;
  en: string;
  yo: string;
  audio: string;
}

interface Props {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export function HistoryList({ items, onSelect }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);

  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>RECENT TRANSLATIONS</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => setExpanded(expanded === item.id ? null : item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.itemHeader}>
              <Text style={styles.enText} numberOfLines={1}>
                {item.en}
              </Text>
              <Text style={styles.chevron}>
                {expanded === item.id ? "↑" : "↓"}
              </Text>
            </View>
            {expanded === item.id && (
              <View style={styles.expanded}>
                <Text style={styles.yoText}>{item.yo}</Text>
                <TouchableOpacity
                  style={styles.reloadBtn}
                  onPress={() => onSelect(item)}
                >
                  <Text style={styles.reloadText}>Load & Play</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 8 },
  heading: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#475569",
    marginBottom: 10,
  },
  item: {
    backgroundColor: "#1a1d27",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#2a2d3a",
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  enText: { fontSize: 13, color: "#94a3b8", flex: 1, marginRight: 8 },
  chevron: { fontSize: 12, color: "#475569" },
  expanded: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#2a2d3a",
    gap: 10,
  },
  yoText: { fontSize: 14, color: "#7dd3fc", lineHeight: 22 },
  reloadBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#1e3a4a",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  reloadText: { fontSize: 12, fontWeight: "600", color: "#7dd3fc" },
});
