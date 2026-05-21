export const colors = {
  bg: "#0f1117",
  surface: "#1a1d27",
  border: "#2a2d3a",
  accent: "#22c55e", // green — voice/active state
  accentDim: "#15803d",
  danger: "#ef4444", // recording state
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  textMuted: "#475569",
  cardEn: "#1e2030",
  cardYo: "#162032",
};

export const typography = {
  heading: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: colors.textPrimary,
  },
  body: { fontSize: 15, color: colors.textSecondary, lineHeight: 24 },
  small: { fontSize: 12, color: colors.textMuted, letterSpacing: 0.5 },
  mono: { fontFamily: "monospace", fontSize: 13 },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 20,
  full: 999,
};
