// styles/designSystem.js
// Chester App - Apple-Inspired Design System with Dark Maroon

export const colors = {
  // 🍎 Primary Colors (Your Dark Maroon Theme)
  primary: "#8B1538", // Your signature dark maroon
  primaryLight: "#A91B47", // Lighter maroon for hover states
  primaryDark: "#6B1028", // Darker maroon for pressed states

  // 🍎 Apple-Inspired Backgrounds
  background: "#FFFFFF", // Pure white (like iOS)
  backgroundSecondary: "#F8F9FA", // Light gray (iOS secondary)
  backgroundTertiary: "#F2F2F7", // iOS tertiary background

  // 🍎 Text Hierarchy (Apple's System)
  textPrimary: "#000000", // True black (high contrast)
  textSecondary: "#3C3C43", // Dark gray (60% opacity)
  textTertiary: "#3C3C4399", // Medium gray (40% opacity)
  textQuaternary: "#3C3C4333", // Light gray (20% opacity)

  // 🍎 iOS System Colors
  systemBlue: "#007AFF", // iOS blue
  systemGreen: "#34C759", // iOS green
  systemRed: "#FF3B30", // iOS red
  systemOrange: "#FF9500", // iOS orange
  systemYellow: "#FFCC00", // iOS yellow
  systemPurple: "#AF52DE", // iOS purple

  // 🍎 Dividers and Borders
  separator: "#3C3C4336", // 20% opacity gray
  separatorOpaque: "#C6C6C8", // Opaque separator

  // 🍎 Surface Colors
  cardBackground: "#FFFFFF", // Card backgrounds
  modalBackground: "#FFFFFF", // Modal backgrounds

  // 🎨 Your Maroon Variations
  maroonSubtle: "#8B15381A", // 10% opacity for subtle backgrounds
  maroonLight: "#8B153833", // 20% opacity for hover states
  maroonMedium: "#8B153866", // 40% opacity for borders
};

export const typography = {
  largeTitle: {
    fontFamily: "",
    fontSize: 34,
    // fontWeight: "700",
    lineHeight: 41,
    letterSpacing: -0.5,
  },

  title1: {
    fontFamily: "Inter_18pt-Bold",
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 34,
    letterSpacing: -0.3,
  },

  title2: {
    fontFamily: "Inter_18pt-SemiBold",
    fontSize: 22,
    fontWeight: "600",
    lineHeight: 28,
    letterSpacing: -0.2,
  },

  title3: {
    fontFamily: "Inter_18pt-SemiBold",
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 25,
    letterSpacing: -0.1,
  },

  headline: {
    fontFamily: "Inter_18pt-SemiBold",
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 22,
    letterSpacing: -0.1,
  },

  body: {
    fontFamily: "Inter_18pt-Regular",
    fontSize: 17,
    fontWeight: "400",
    lineHeight: 22,
    letterSpacing: 0,
  },

  subheadline: {
    fontFamily: "Inter_18pt-Medium",
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 20,
    letterSpacing: 0,
  },

  footnote: {
    fontFamily: "Inter_18pt-Medium",
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
    letterSpacing: 0,
  },

  caption1: {
    fontFamily: "Inter_18pt-Medium",
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
    letterSpacing: 0,
  },

  caption2: {
    fontFamily: "Inter_18pt-Regular",
    fontSize: 11,
    fontWeight: "400",
    lineHeight: 13,
    letterSpacing: 0.1,
  },
};

export const spacing = {
  // 🍎 Apple's 4pt Grid System
  xs: 4, // Extra small
  sm: 8, // Small
  md: 12, // Medium (most common)
  lg: 16, // Large
  xl: 20, // Extra large
  xxl: 24, // Double extra large
  xxxl: 32, // Triple extra large

  // 🍎 Component-Specific Spacing
  cardPadding: 20, // Standard card padding
  screenPadding: 24, // Screen edge padding
  sectionSpacing: 32, // Between major sections
  elementSpacing: 16, // Between related elements
  tightSpacing: 8, // Tight spacing
};

export const borderRadius = {
  // 🍎 Apple's Border Radius Scale
  small: 8, // Small elements (buttons, tags)
  medium: 12, // Standard elements (cards, inputs)
  large: 16, // Large containers
  xlarge: 20, // Extra large containers
  round: 50, // Circular (avatars, floating buttons)
};

export const shadows = {
  // 🍎 Apple's Shadow System
  card: {
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2, // Android
  },

  floating: {
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4, // Android
  },

  modal: {
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8, // Android
  },

  // Maroon-specific shadows
  maroonGlow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6, // Android
  },
};

export const opacity = {
  // 🍎 Standard Opacity Levels
  disabled: 0.3,
  secondary: 0.6,
  overlay: 0.8,
  background: 0.95,
};

export const hitSlop = {
  // 🍎 Touch Target Guidelines (44pt minimum)
  small: { top: 8, bottom: 8, left: 8, right: 8 },
  medium: { top: 12, bottom: 12, left: 12, right: 12 },
  large: { top: 16, bottom: 16, left: 16, right: 16 },
};

export const layout = {
  // 🍎 Common Layout Values
  minTouchTarget: 44, // Apple's minimum touch target
  tabBarHeight: 70, // Bottom tab bar height
  headerHeight: 60, // Navigation header height
  buttonHeight: 50, // Standard button height
  inputHeight: 48, // Standard input height
};

// 🎨 Component-Specific Style Objects (Ready to use with spread operator)
export const buttonStyles = {
  primary: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minHeight: layout.buttonHeight,
    ...shadows.maroonGlow,
  },

  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minHeight: layout.buttonHeight,
  },

  text: {
    backgroundColor: "transparent",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
};

export const cardStyles = {
  standard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.large,
    padding: spacing.cardPadding,
    ...shadows.card,
  },

  elevated: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.large,
    padding: spacing.cardPadding,
    ...shadows.floating,
  },

  withMaroonBorder: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.large,
    padding: spacing.cardPadding,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    ...shadows.card,
  },
};

export const inputStyles = {
  standard: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: layout.inputHeight,
    ...typography.body,
    color: colors.textPrimary,
  },

  focused: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
    ...shadows.card,
  },
};
