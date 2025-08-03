// styles/cards.js
export const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16, // Apple uses larger radius for cards
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, // Very subtle shadow
    shadowRadius: 8,
    elevation: 3,
  },

  padding: {
    padding: 20, // Generous padding like Apple
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  title: {
    ...typography.headline,
    color: colors.textPrimary,
    fontWeight: "600",
  },

  subtitle: {
    ...typography.subheadline,
    color: colors.textSecondary,
    marginTop: 2,
  },

  content: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 24,
  },

  // Journal entry specific
  journalCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    margin: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
});
