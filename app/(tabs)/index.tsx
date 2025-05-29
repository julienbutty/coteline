import React from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function ProjectsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Projets</Text>
        <Text style={styles.subtitle}>Gestion de vos chantiers menuiserie</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialIcons name="build" size={24} color="#FF6B35" />
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>En cours</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialIcons name="pending" size={24} color="#FF9800" />
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>En attente</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
          <Text style={styles.statNumber}>23</Text>
          <Text style={styles.statLabel}>Terminés</Text>
        </View>
      </View>

      <View style={styles.projectsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Projets récents</Text>
          <Pressable style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>Voir tout</Text>
          </Pressable>
        </View>

        <View style={styles.projectCard}>
          <View style={styles.projectHeader}>
            <View style={styles.projectInfo}>
              <Text style={styles.projectName}>Résidence Les Chênes</Text>
              <Text style={styles.projectClient}>Dupont Constructions</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>En cours</Text>
            </View>
          </View>
          
          <View style={styles.projectDetails}>
            <View style={styles.projectStat}>
              <MaterialIcons name="window" size={16} color="#757575" />
              <Text style={styles.projectStatText}>24 fenêtres</Text>
            </View>
            <View style={styles.projectStat}>
              <MaterialIcons name="door-front" size={16} color="#757575" />
              <Text style={styles.projectStatText}>8 portes</Text>
            </View>
            <View style={styles.projectStat}>
              <MaterialIcons name="euro" size={16} color="#757575" />
              <Text style={styles.projectStatText}>45 250€</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Avancement: 65%</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '65%' }]} />
            </View>
          </View>
        </View>

        <View style={styles.projectCard}>
          <View style={styles.projectHeader}>
            <View style={styles.projectInfo}>
              <Text style={styles.projectName}>Maison individuelle</Text>
              <Text style={styles.projectClient}>Martin Rénovation</Text>
            </View>
            <View style={[styles.statusBadge, styles.statusPending]}>
              <Text style={styles.statusText}>Devis</Text>
            </View>
          </View>
          
          <View style={styles.projectDetails}>
            <View style={styles.projectStat}>
              <MaterialIcons name="window" size={16} color="#757575" />
              <Text style={styles.projectStatText}>12 fenêtres</Text>
            </View>
            <View style={styles.projectStat}>
              <MaterialIcons name="door-front" size={16} color="#757575" />
              <Text style={styles.projectStatText}>4 portes</Text>
            </View>
            <View style={styles.projectStat}>
              <MaterialIcons name="euro" size={16} color="#757575" />
              <Text style={styles.projectStatText}>28 900€</Text>
            </View>
          </View>
        </View>

        <View style={styles.projectCard}>
          <View style={styles.projectHeader}>
            <View style={styles.projectInfo}>
              <Text style={styles.projectName}>Immeuble centre-ville</Text>
              <Text style={styles.projectClient}>Société Habitat Plus</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>En cours</Text>
            </View>
          </View>
          
          <View style={styles.projectDetails}>
            <View style={styles.projectStat}>
              <MaterialIcons name="window" size={16} color="#757575" />
              <Text style={styles.projectStatText}>156 fenêtres</Text>
            </View>
            <View style={styles.projectStat}>
              <MaterialIcons name="door-front" size={16} color="#757575" />
              <Text style={styles.projectStatText}>48 portes</Text>
            </View>
            <View style={styles.projectStat}>
              <MaterialIcons name="euro" size={16} color="#757575" />
              <Text style={styles.projectStatText}>185 600€</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Avancement: 20%</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '20%' }]} />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        
        <View style={styles.actionsGrid}>
          <Pressable style={styles.actionCard}>
            <MaterialIcons name="add-box" size={32} color="#FF6B35" />
            <Text style={styles.actionText}>Nouveau projet</Text>
          </Pressable>

          <Pressable style={styles.actionCard}>
            <MaterialIcons name="calculate" size={32} color="#FF6B35" />
            <Text style={styles.actionText}>Calculateur</Text>
          </Pressable>

          <Pressable style={styles.actionCard}>
            <MaterialIcons name="inventory" size={32} color="#FF6B35" />
            <Text style={styles.actionText}>Stock</Text>
          </Pressable>

          <Pressable style={styles.actionCard}>
            <MaterialIcons name="description" size={32} color="#FF6B35" />
            <Text style={styles.actionText}>Devis</Text>
          </Pressable>
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
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  projectsSection: {
    padding: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  viewAllButton: {
    padding: theme.spacing.sm,
  },
  viewAllText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  projectCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  projectClient: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
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
  projectDetails: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  projectStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  projectStatText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  progressContainer: {
    marginTop: theme.spacing.sm,
  },
  progressLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  quickActions: {
    padding: theme.spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  actionCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    width: '47%',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  actionText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeight.medium,
  },
}));
