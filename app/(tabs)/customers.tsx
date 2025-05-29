import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export default function CustomersScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestion Clients</Text>
        <Text style={styles.subtitle}>Contacts et projets associés</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Clients actifs</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>28</Text>
          <Text style={styles.statLabel}>Projets en cours</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Devis en attente</Text>
        </View>
      </View>

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Clients récents</Text>
        
        <View style={styles.customerCard}>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>Dupont Constructions</Text>
            <Text style={styles.customerProject}>Projet: Résidence Les Chênes</Text>
            <Text style={styles.customerDate}>Dernière activité: il y a 2 jours</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Actif</Text>
          </View>
        </View>

        <View style={styles.customerCard}>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>Martin Rénovation</Text>
            <Text style={styles.customerProject}>Projet: Maison individuelle</Text>
            <Text style={styles.customerDate}>Dernière activité: il y a 1 semaine</Text>
          </View>
          <View style={[styles.statusBadge, styles.statusPending]}>
            <Text style={styles.statusText}>En attente</Text>
          </View>
        </View>

        <View style={styles.customerCard}>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>Société Habitat Plus</Text>
            <Text style={styles.customerProject}>Projet: Immeuble centre-ville</Text>
            <Text style={styles.customerDate}>Dernière activité: il y a 3 jours</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Actif</Text>
          </View>
        </View>
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
  statsContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
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
    textAlign: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    color: '#FFFFFF',
    fontWeight: theme.typography.fontWeight.medium,
  },
})); 