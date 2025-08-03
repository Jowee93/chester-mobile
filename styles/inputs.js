// styles/inputs.js
export const inputStyles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  label: {
    ...typography.subheadline,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: "500",
  },

  input: {
    backgroundColor: colors.backgroundTertiary, // Light gray like iOS
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    ...typography.body,
    color: colors.textPrimary,
    borderWidth: 0, // Apple style has no borders
  },

  inputFocused: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  textArea: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    ...typography.body,
    color: colors.textPrimary,
    minHeight: 120,
    textAlignVertical: "top",
  },
});
