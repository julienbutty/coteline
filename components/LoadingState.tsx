import React from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Ionicons } from "@expo/vector-icons";

interface LoadingStateProps {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
  emptyMessage?: string;
  isEmpty?: boolean;
}

export function LoadingState({
  loading,
  error,
  onRetry,
  children,
  emptyMessage = "Aucune donnée disponible",
  isEmpty = false,
}: LoadingStateProps) {
  const { theme } = useUnistyles();
  const styles = stylesheet(theme);
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color={theme.colors.error}
        />
        <Text style={styles.errorText}>{error}</Text>
        {onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons
          name="folder-open-outline"
          size={48}
          color={theme.colors.textTertiary}
        />
        <Text style={styles.emptyText}>{emptyMessage}</Text>
        {onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryButtonText}>Actualiser</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return <>{children}</>;
}

const stylesheet = (theme: any) =>
  StyleSheet.create({
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.xl,
      minHeight: 200,
    },
    loadingText: {
      marginTop: theme.spacing.md,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    errorText: {
      marginTop: theme.spacing.md,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.error,
      textAlign: "center",
      marginBottom: theme.spacing.lg,
    },
    emptyText: {
      marginTop: theme.spacing.md,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.lg,
    },
    retryButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radius.md,
    },
    retryButtonText: {
      color: "white",
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semibold,
    },
  });
