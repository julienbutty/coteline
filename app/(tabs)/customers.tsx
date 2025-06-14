import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useFocusEffect } from "expo-router";
import { useClients } from "../../hooks/useSupabase";
import { LoadingState } from "../../components/LoadingState";
import { Header } from "../../components/Header";
import { ContactsList } from "../../components/ContactsList";
import { FloatingActionButton } from "../../components/FloatingActionButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomersScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const { data: clients, loading, error, refetch } = useClients();

  // Rafraîchir les données quand l'écran devient actif
  useFocusEffect(
    React.useCallback(() => {
      console.log("Écran clients focalisé - rafraîchissement des données");
      refetch();
    }, [refetch])
  );

  const handleCustomerPress = (customerId: string) => {
    router.push(`/customer/${customerId}` as any);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Contacts"
        subtitle={`${clients.length} contact${clients.length > 1 ? "s" : ""}`}
      />

      {/* Statistiques rapides */}
      {!loading && clients.length > 0 && (
        <View style={styles.quickStats}>
          <Text style={styles.quickStatsText}>
            {clients.reduce(
              (total, client) => total + client.projets.length,
              0
            )}{" "}
            projets •{" "}
            {
              clients.filter(
                (client) =>
                  client.updatedAt >
                  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              ).length
            }{" "}
            récents
          </Text>
        </View>
      )}

      {/* Liste des contacts */}
      <LoadingState
        loading={loading}
        error={error}
        onRetry={refetch}
        isEmpty={clients.length === 0}
        emptyMessage="Aucun contact enregistré"
      >
        <ContactsList
          clients={clients}
          onClientPress={handleCustomerPress}
          loading={loading}
        />
      </LoadingState>

      {/* Bouton d'action flottant */}
      <FloatingActionButton
        onPress={() => router.push("/customer/create")}
        icon="person-add"
        label="Nouveau"
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
  statsContainer: {
    flexDirection: "row",
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  statNumber: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.xs,
  },
  recentSection: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  customerCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  customerProject: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  customerDate: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
  },
  statusBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
  statusPending: {
    backgroundColor: theme.colors.warning,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    color: "#FFFFFF",
    fontWeight: theme.typography.fontWeight.medium,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: "center",
    justifyContent: "center",
  },
  quickStats: {
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  quickStatsText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
}));
