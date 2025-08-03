// styles/buttons.js
import { colors, typography } from "./designSystem/designSystem";

export const buttonStyles = StyleSheet.create({
  // Primary button (your maroon)
  primaryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12, // Apple's 12px radius
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50, // Apple's 50pt minimum
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  primaryButtonText: {
    ...typography.headline,
    color: colors.background,
    fontWeight: "600",
  },

  // Secondary button (outline style)
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5, // Apple uses thicker borders
    borderColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },

  secondaryButtonText: {
    ...typography.headline,
    color: colors.primary,
    fontWeight: "600",
  },

  // Text button (minimal)
  textButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  textButtonText: {
    ...typography.headline,
    color: colors.primary,
    fontWeight: "500",
  },
});
