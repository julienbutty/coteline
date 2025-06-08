import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { projects } from '../../data/mockData';
import { Project } from '../../types';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Trouver le projet correspondant
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error" size={48} color="#F44336" />
        <Text style={styles.errorText}>Projet introuvable</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Retour</Text>
        </Pressable>
      </View>
    );
  }

  const getStatusColor = (statut: Project['statut']) => {
    switch (statut) {
      case 'en_cours': return '#4CAF50';
      case 'brouillon': return '#FF9800';
      case 'termine': return '#2196F3';
      case 'annule': return '#F44336';
      default: return '#757575';
    }
  };

  const getStatusLabel = (statut: Project['statut']) => {
    switch (statut) {
      case 'en_cours': return 'En cours';
      case 'brouillon': return 'Brouillon';
      case 'termine': return 'Terminé';
      case 'annule': return 'Annulé';
      default: return statut;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };



  return (
    <ScrollView style={styles.container}>
      {/* Header du projet */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.titleContainer}>
            <Text style={styles.projectName}>{project.nom}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.statut) }]}>
              <Text style={styles.statusText}>{getStatusLabel(project.statut)}</Text>
            </View>
          </View>
        </View>
        
        {project.description && (
          <Text style={styles.description}>{project.description}</Text>
        )}

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {project.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Informations Client */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="person" size={24} color="#FF6B35" />
          <Text style={styles.sectionTitle}>Client</Text>
        </View>
        
        <View style={styles.clientCard}>
          <Text style={styles.clientName}>
            {project.client.entreprise || `${project.client.prenom} ${project.client.nom}`}
          </Text>
          {project.client.entreprise && (
            <Text style={styles.clientContact}>
              {project.client.prenom} {project.client.nom}
            </Text>
          )}
          
          <View style={styles.contactRow}>
            <MaterialIcons name="email" size={16} color="#757575" />
            <Text style={styles.contactText}>{project.client.email}</Text>
          </View>
          
          <View style={styles.contactRow}>
            <MaterialIcons name="phone" size={16} color="#757575" />
            <Text style={styles.contactText}>{project.client.telephone}</Text>
          </View>

          <View style={styles.contactRow}>
            <MaterialIcons name="location-on" size={16} color="#757575" />
            <Text style={styles.contactText}>
              {project.client.adresse.rue}, {project.client.adresse.ville} {project.client.adresse.codePostal}
            </Text>
          </View>
        </View>
      </View>

      {/* Adresse du chantier */}
      {project.adresseChantier && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="construction" size={24} color="#FF6B35" />
            <Text style={styles.sectionTitle}>Adresse du chantier</Text>
          </View>
          
          <View style={styles.addressCard}>
            <Text style={styles.addressText}>
              {project.adresseChantier.rue}
            </Text>
            <Text style={styles.addressText}>
              {project.adresseChantier.codePostal} {project.adresseChantier.ville}
            </Text>
          </View>
        </View>
      )}

      {/* Planning */}
      {(project.dateDebutPrevue || project.dateFinPrevue) && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="schedule" size={24} color="#FF6B35" />
            <Text style={styles.sectionTitle}>Planning</Text>
          </View>
          
          <View style={styles.planningCard}>
            {project.dateDebutPrevue && (
              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>Début prévu :</Text>
                <Text style={styles.dateValue}>{formatDate(project.dateDebutPrevue)}</Text>
              </View>
            )}
            
            {project.dateFinPrevue && (
              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>Fin prévue :</Text>
                <Text style={styles.dateValue}>{formatDate(project.dateFinPrevue)}</Text>
              </View>
            )}
          </View>
        </View>
      )}



      {/* Liste des produits */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="inventory" size={24} color="#FF6B35" />
          <Text style={styles.sectionTitle}>Produits ({project.produits.length})</Text>
          <Pressable style={styles.addButton}>
            <MaterialIcons name="add" size={20} color="#FF6B35" />
          </Pressable>
        </View>

        {project.produits.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="inventory" size={48} color="#9E9E9E" />
            <Text style={styles.emptyText}>Aucun produit ajouté</Text>
            <Pressable style={styles.addProductButton}>
              <Text style={styles.addProductText}>Ajouter un produit</Text>
            </Pressable>
          </View>
        ) : (
          project.produits.map((produit, index) => (
            <View key={produit.id} style={styles.productCard}>
              <View style={styles.productHeader}>
                <Text style={styles.productName}>{produit.product.nom}</Text>
                <View style={[styles.productStatusBadge, { 
                  backgroundColor: produit.statut === 'valide' ? '#4CAF50' : 
                                 produit.statut === 'commande' ? '#2196F3' : '#FF9800'
                }]}>
                  <Text style={styles.productStatusText}>{produit.statut}</Text>
                </View>
              </View>
              
              <Text style={styles.productDescription}>{produit.product.description}</Text>
              
              <View style={styles.productDetails}>
                <View style={styles.productDetailRow}>
                  <MaterialIcons name="straighten" size={16} color="#757575" />
                  <Text style={styles.productDetailText}>
                    {produit.dimensions.largeur} × {produit.dimensions.hauteur} mm
                  </Text>
                </View>
                
                <View style={styles.productDetailRow}>
                  <MaterialIcons name="format-list-numbered" size={16} color="#757575" />
                  <Text style={styles.productDetailText}>Quantité : {produit.quantite}</Text>
                </View>
                
                <View style={styles.productDetailRow}>
                  <MaterialIcons name="palette" size={16} color="#757575" />
                  <Text style={styles.productDetailText}>
                    {produit.parametres.materiau} - {produit.parametres.couleur}
                  </Text>
                </View>

                <View style={styles.productDetailRow}>
                  <MaterialIcons name="schedule" size={16} color="#757575" />
                  <Text style={styles.productDetailText}>
                    Créé le {produit.createdAt.toLocaleDateString('fr-FR')}
                  </Text>
                </View>
              </View>

              {produit.notes && (
                <View style={styles.productNotes}>
                  <Text style={styles.productNotesText}>📝 {produit.notes}</Text>
                </View>
              )}
              
              {/* Actions produit */}
              <View style={styles.productActions}>
                <Pressable 
                  style={styles.measureButton}
                  onPress={() => router.push(`/measure/${produit.id}`)}
                >
                  <MaterialIcons name="straighten" size={18} color="#FF6B35" />
                  <Text style={styles.measureButtonText}>Prendre mesures</Text>
                </Pressable>
                
                <Pressable style={styles.editProductButton}>
                  <MaterialIcons name="edit" size={18} color="#757575" />
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Notes du projet */}
      {project.notes && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="note" size={24} color="#FF6B35" />
            <Text style={styles.sectionTitle}>Notes</Text>
          </View>
          
          <View style={styles.notesCard}>
            <Text style={styles.notesText}>{project.notes}</Text>
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actionsSection}>
        <Pressable style={styles.actionButton}>
          <MaterialIcons name="edit" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Modifier</Text>
        </Pressable>
        
        <Pressable style={[styles.actionButton, styles.secondaryButton]}>
          <MaterialIcons name="share" size={20} color="#FF6B35" />
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Partager</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  errorText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: theme.typography.fontWeight.medium,
  },
  header: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTop: {
    marginBottom: theme.spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  projectName: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.md,
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
  description: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.md,
    marginBottom: theme.spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  tag: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.round,
  },
  tagText: {
    fontSize: theme.typography.fontSize.xs,
    color: '#FFFFFF',
    fontWeight: theme.typography.fontWeight.medium,
  },
  section: {
    backgroundColor: theme.colors.surface,
    marginTop: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  addButton: {
    padding: theme.spacing.xs,
  },
  clientCard: {
    backgroundColor: theme.colors.surfaceVariant,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  clientName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  clientContact: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  contactText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  addressCard: {
    backgroundColor: theme.colors.surfaceVariant,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  addressText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  planningCard: {
    backgroundColor: theme.colors.surfaceVariant,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  dateLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  dateValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
  },
  budgetCard: {
    backgroundColor: theme.colors.surfaceVariant,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  budgetLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  budgetValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  emptyState: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  addProductButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  addProductText: {
    color: '#FFFFFF',
    fontWeight: theme.typography.fontWeight.medium,
  },
  productCard: {
    backgroundColor: theme.colors.surfaceVariant,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  productName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  productStatusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
  productStatusText: {
    fontSize: theme.typography.fontSize.xs,
    color: '#FFFFFF',
    fontWeight: theme.typography.fontWeight.medium,
  },
  productDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  productDetails: {
    gap: theme.spacing.sm,
  },
  productDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productDetailText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  productNotes: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
  },
  productNotesText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  measureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    gap: theme.spacing.xs,
    flex: 1,
    justifyContent: 'center',
  },
  measureButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: '#FF6B35',
  },
  editProductButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesCard: {
    backgroundColor: theme.colors.surfaceVariant,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  notesText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeight.md,
  },
  actionsSection: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    gap: theme.spacing.sm,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  secondaryButtonText: {
    color: theme.colors.primary,
  },
})); 