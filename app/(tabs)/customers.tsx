import React from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { router } from 'expo-router';
import { clients } from '../../data/mockData';

export default function CustomersScreen() {
  const handleCustomerPress = (customerId: string) => {
    router.push(`/customer/${customerId}` as any);
  };

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
        
        {clients.map((client) => (
          <TouchableOpacity 
            key={client.id}
            style={styles.customerCard}
            onPress={() => handleCustomerPress(client.id)}
          >
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>
                {client.entreprise || `${client.prenom} ${client.nom}`}
              </Text>
              <Text style={styles.customerProject}>
                {client.projets.length} projet{client.projets.length > 1 ? 's' : ''} associé{client.projets.length > 1 ? 's' : ''}
              </Text>
              <Text style={styles.customerDate}>
                Dernière activité: {client.updatedAt.toLocaleDateString('fr-FR')}
              </Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Actif</Text>
            </View>
          </TouchableOpacity>
        ))}
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