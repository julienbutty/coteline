import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export default function ProductsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Catalogue Produits</Text>
        <Text style={styles.subtitle}>Fenêtres, portes, portails & volets</Text>
      </View>

      <View style={styles.categoriesContainer}>
        <View style={styles.categoryCard}>
          <Text style={styles.categoryTitle}>🪟 Fenêtres</Text>
          <Text style={styles.categoryCount}>24 produits</Text>
        </View>

        <View style={styles.categoryCard}>
          <Text style={styles.categoryTitle}>🚪 Portes</Text>
          <Text style={styles.categoryCount}>18 produits</Text>
        </View>

        <View style={styles.categoryCard}>
          <Text style={styles.categoryTitle}>🚧 Portails</Text>
          <Text style={styles.categoryCount}>12 produits</Text>
        </View>

        <View style={styles.categoryCard}>
          <Text style={styles.categoryTitle}>🪟 Volets</Text>
          <Text style={styles.categoryCount}>8 produits</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Base de données produits</Text>
        <Text style={styles.infoText}>
          Consultez et gérez tous les types de menuiseries avec leurs dimensions,
          matériaux et caractéristiques techniques.
        </Text>
      </View>
    </ScrollView>
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
  categoriesContainer: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  categoryCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  categoryTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  categoryCount: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  infoSection: {
    margin: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.secondary,
  },
  infoTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.md,
  },
})); 