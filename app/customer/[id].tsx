import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { clients, projects } from '../../data/mockData';

export default function CustomerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'info' | 'projects' | 'history'>('info');

  const client = clients.find(c => c.id === id);
  const clientProjects = projects.filter(p => p.clientId === id);

  if (!client) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Client non trouvé</Text>
      </View>
    );
  }

  const handleCall = () => {
    if (client.telephone) {
      Linking.openURL(`tel:${client.telephone}`);
    }
  };

  const handleEmail = () => {
    if (client.email) {
      Linking.openURL(`mailto:${client.email}`);
    }
  };

  const handleProjectPress = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_cours': return '#4CAF50';
      case 'brouillon': return '#FF9800';
      case 'termine': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'en_cours': return 'En cours';
      case 'brouillon': return 'Brouillon';
      case 'termine': return 'Terminé';
      default: return 'Inconnu';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header avec informations principales */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.clientName}>
            {client.entreprise || `${client.prenom} ${client.nom}`}
          </Text>
          {client.entreprise && (
            <Text style={styles.contactName}>
              Contact: {client.prenom} {client.nom}
            </Text>
          )}
          <Text style={styles.clientSince}>
            Client depuis le {client.createdAt.toLocaleDateString('fr-FR')}
          </Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Ionicons name="call" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleEmail}>
            <Ionicons name="mail" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats rapides */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{clientProjects.length}</Text>
          <Text style={styles.statLabel}>Projets</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {clientProjects.filter(p => p.statut === 'en_cours').length}
          </Text>
          <Text style={styles.statLabel}>En cours</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {clientProjects.filter(p => p.statut === 'termine').length}
          </Text>
          <Text style={styles.statLabel}>Terminés</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {clientProjects.filter(p => p.statut === 'brouillon').length}
          </Text>
          <Text style={styles.statLabel}>Brouillons</Text>
        </View>
      </View>

      {/* Onglets */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'info' && styles.activeTab]}
          onPress={() => setActiveTab('info')}
        >
          <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
            Informations
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'projects' && styles.activeTab]}
          onPress={() => setActiveTab('projects')}
        >
          <Text style={[styles.tabText, activeTab === 'projects' && styles.activeTabText]}>
            Projets
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            Historique
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenu des onglets */}
      <View style={styles.tabContent}>
        {activeTab === 'info' && (
          <View>
            {/* Coordonnées */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Coordonnées</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Ionicons name="person" size={20} color="#666" />
                  <Text style={styles.infoText}>
                    {client.prenom} {client.nom}
                  </Text>
                </View>
                {client.entreprise && (
                  <View style={styles.infoRow}>
                    <Ionicons name="business" size={20} color="#666" />
                    <Text style={styles.infoText}>{client.entreprise}</Text>
                  </View>
                )}
                <TouchableOpacity style={styles.infoRow} onPress={handleCall}>
                  <Ionicons name="call" size={20} color="#2F22CF" />
                  <Text style={[styles.infoText, styles.linkText]}>{client.telephone}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.infoRow} onPress={handleEmail}>
                  <Ionicons name="mail" size={20} color="#2F22CF" />
                  <Text style={[styles.infoText, styles.linkText]}>{client.email}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Adresse */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Adresse</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Ionicons name="location" size={20} color="#666" />
                  <View style={styles.addressContainer}>
                    <Text style={styles.infoText}>{client.adresse.rue}</Text>
                    <Text style={styles.infoText}>
                      {client.adresse.codePostal} {client.adresse.ville}
                    </Text>
                    <Text style={styles.infoText}>{client.adresse.pays}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Notes */}
            {client.notes && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <View style={styles.infoCard}>
                  <Text style={styles.notesText}>{client.notes}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {activeTab === 'projects' && (
          <View>
            <Text style={styles.sectionTitle}>Projets ({clientProjects.length})</Text>
            {clientProjects.map((project) => (
              <TouchableOpacity 
                key={project.id}
                style={styles.projectCard}
                onPress={() => handleProjectPress(project.id)}
              >
                <View style={styles.projectHeader}>
                  <Text style={styles.projectName}>{project.nom}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.statut) }]}>
                    <Text style={styles.statusText}>{getStatusText(project.statut)}</Text>
                  </View>
                </View>
                <Text style={styles.projectDescription}>{project.description}</Text>
                <View style={styles.projectMeta}>
                  <Text style={styles.projectDate}>
                    Créé le {project.createdAt.toLocaleDateString('fr-FR')}
                  </Text>
                  <Text style={styles.projectDate}>
                    Modifié le {project.updatedAt.toLocaleDateString('fr-FR')}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'history' && (
          <View>
            <Text style={styles.sectionTitle}>Historique des interactions</Text>
            <View style={styles.historyCard}>
              <View style={styles.historyItem}>
                <View style={styles.historyIcon}>
                  <Ionicons name="create" size={16} color="#2F22CF" />
                </View>
                <View style={styles.historyContent}>
                  <Text style={styles.historyAction}>Client créé</Text>
                  <Text style={styles.historyDate}>
                    {client.createdAt.toLocaleDateString('fr-FR')}
                  </Text>
                </View>
              </View>
              <View style={styles.historyItem}>
                <View style={styles.historyIcon}>
                  <Ionicons name="refresh" size={16} color="#4CAF50" />
                </View>
                <View style={styles.historyContent}>
                  <Text style={styles.historyAction}>Dernière mise à jour</Text>
                  <Text style={styles.historyDate}>
                    {client.updatedAt.toLocaleDateString('fr-FR')}
                  </Text>
                </View>
              </View>
              {clientProjects.map((project) => (
                <View key={project.id} style={styles.historyItem}>
                  <View style={styles.historyIcon}>
                    <Ionicons name="add-circle" size={16} color="#FF6B35" />
                  </View>
                  <View style={styles.historyContent}>
                    <Text style={styles.historyAction}>Projet "{project.nom}" créé</Text>
                    <Text style={styles.historyDate}>
                      {project.createdAt.toLocaleDateString('fr-FR')}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  errorText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl + 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  clientName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
  },
  contactName: {
    fontSize: theme.typography.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: theme.spacing.xs,
  },
  clientSince: {
    fontSize: theme.typography.fontSize.xs,
    color: 'rgba(255,255,255,0.7)',
  },
  quickActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
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
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabContent: {
    padding: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  infoText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  linkText: {
    color: theme.colors.primary,
  },
  addressContainer: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  notesText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    lineHeight: 22,
    fontStyle: 'italic',
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
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  projectName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    color: '#FFFFFF',
    fontWeight: theme.typography.fontWeight.medium,
  },
  projectDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  projectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  projectDate: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
  },
  historyCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(47, 34, 207, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  historyContent: {
    flex: 1,
  },
  historyAction: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
  },
  historyDate: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
})); 