import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { products, productCategories, projects } from '../../data/mockData';

const { width: screenWidth } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'specs' | 'dimensions' | 'projects'>('specs');

  const product = products.find(p => p.id === id);
  const category = product ? productCategories.find(c => c.id === product.categoryId) : null;
  const relatedProjects = projects.filter(p => 
    p.produits.some(pp => pp.productId === id)
  );

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Produit non trouvé</Text>
      </View>
    );
  }

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'fenetre': return 'albums-outline';
      case 'porte': return 'exit-outline';
      case 'portail': return 'grid-outline';
      case 'volet': return 'layers-outline';
      default: return 'square-outline';
    }
  };

  const handleAddToProject = () => {
    // TODO: Implémenter l'ajout à un projet
    console.log('Ajouter au projet', product.id);
  };

  const renderSpecifications = () => (
    <View style={styles.tabContent}>
      <View style={styles.specSection}>
        <Text style={styles.specSectionTitle}>Matériaux disponibles</Text>
        <View style={styles.specGrid}>
          {product.specifications.materiaux?.map((material, index) => (
            <View key={index} style={styles.specChip}>
              <Ionicons name="construct-outline" size={16} color="#2F22CF" />
              <Text style={styles.specChipText}>{material}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.specSection}>
        <Text style={styles.specSectionTitle}>Couleurs disponibles</Text>
        <View style={styles.specGrid}>
          {product.specifications.couleurs?.map((color, index) => (
            <View key={index} style={styles.specChip}>
              <View style={[styles.colorDot, { backgroundColor: getColorCode(color) }]} />
              <Text style={styles.specChipText}>{color}</Text>
            </View>
          ))}
        </View>
      </View>

      {product.specifications.typesVitrage && (
        <View style={styles.specSection}>
          <Text style={styles.specSectionTitle}>Types de vitrage</Text>
          <View style={styles.specGrid}>
            {product.specifications.typesVitrage.map((vitrage, index) => (
              <View key={index} style={styles.specChip}>
                <Ionicons name="layers-outline" size={16} color="#2F22CF" />
                <Text style={styles.specChipText}>{vitrage}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {product.specifications.systemeOuverture && (
        <View style={styles.specSection}>
          <Text style={styles.specSectionTitle}>Systèmes d'ouverture</Text>
          <View style={styles.specGrid}>
            {product.specifications.systemeOuverture.map((system, index) => (
              <View key={index} style={styles.specChip}>
                <Ionicons name="open-outline" size={16} color="#2F22CF" />
                <Text style={styles.specChipText}>{system}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderDimensions = () => (
    <View style={styles.tabContent}>
      <View style={styles.dimensionCard}>
        <Text style={styles.dimensionTitle}>Dimensions standard</Text>
        
        <View style={styles.dimensionRow}>
          <View style={styles.dimensionItem}>
            <Ionicons name="resize-outline" size={24} color="#2F22CF" />
            <View style={styles.dimensionInfo}>
              <Text style={styles.dimensionLabel}>Largeur</Text>
              <Text style={styles.dimensionValue}>
                {product.dimensionsParDefaut.largeurMin} - {product.dimensionsParDefaut.largeurMax} mm
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.dimensionRow}>
          <View style={styles.dimensionItem}>
            <Ionicons name="resize-outline" size={24} color="#2F22CF" style={{ transform: [{ rotate: '90deg' }] }} />
            <View style={styles.dimensionInfo}>
              <Text style={styles.dimensionLabel}>Hauteur</Text>
              <Text style={styles.dimensionValue}>
                {product.dimensionsParDefaut.hauteurMin} - {product.dimensionsParDefaut.hauteurMax} mm
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.dimensionNote}>
          <Ionicons name="information-circle-outline" size={20} color="#FF6B35" />
          <Text style={styles.dimensionNoteText}>
            Dimensions personnalisées disponibles sur demande
          </Text>
        </View>
      </View>

      <View style={styles.calculatorCard}>
        <Text style={styles.calculatorTitle}>Informations techniques</Text>
        <Text style={styles.calculatorSubtitle}>Référence produit: {product.id}</Text>
        
        <View style={styles.calculatorRow}>
          <Text style={styles.calculatorLabel}>Type:</Text>
          <Text style={styles.quantityText}>{product.type}</Text>
        </View>

        <View style={styles.calculatorRow}>
          <Text style={styles.calculatorLabel}>Créé le:</Text>
          <Text style={styles.quantityText}>{product.createdAt.toLocaleDateString('fr-FR')}</Text>
        </View>

        <View style={styles.calculatorRow}>
          <Text style={styles.calculatorLabel}>Modifié le:</Text>
          <Text style={styles.quantityText}>{product.updatedAt.toLocaleDateString('fr-FR')}</Text>
        </View>
      </View>
    </View>
  );

  const renderProjects = () => (
    <View style={styles.tabContent}>
      {relatedProjects.length > 0 ? (
        <>
          <Text style={styles.projectsTitle}>
            Utilisé dans {relatedProjects.length} projet{relatedProjects.length > 1 ? 's' : ''}
          </Text>
          {relatedProjects.map((project) => (
            <TouchableOpacity 
              key={project.id}
              style={styles.projectCard}
              onPress={() => router.push(`/project/${project.id}` as any)}
            >
              <View style={styles.projectHeader}>
                <Text style={styles.projectName}>{project.nom}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.statut) }]}>
                  <Text style={styles.statusText}>{getStatusText(project.statut)}</Text>
                </View>
              </View>
              <Text style={styles.projectClient}>Client: {project.client?.entreprise || `${project.client?.prenom} ${project.client?.nom}`}</Text>
              <Text style={styles.projectDescription}>{project.description}</Text>
            </TouchableOpacity>
          ))}
        </>
      ) : (
        <View style={styles.emptyProjects}>
          <Ionicons name="folder-outline" size={48} color="#CCC" />
          <Text style={styles.emptyProjectsTitle}>Aucun projet associé</Text>
          <Text style={styles.emptyProjectsText}>
            Ce produit n'est utilisé dans aucun projet pour le moment
          </Text>
        </View>
      )}
    </View>
  );

  const getColorCode = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      'Blanc': '#FFFFFF',
      'Anthracite': '#2F3C3C',
      'Chêne doré': '#D4A574',
      'Gris 7016': '#383E42',
      'Blanc RAL 9016': '#F6F6F6',
      'Anthracite RAL 7016': '#383E42',
      'Bronze': '#CD7F32',
      'Inox': '#C0C0C0',
      'Chêne': '#8B4513',
      'Noyer': '#654321',
      'Vert RAL 6005': '#114232'
    };
    return colorMap[colorName] || '#CCCCCC';
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
          <View style={styles.productIcon}>
            <Ionicons 
              name={getProductIcon(product.type) as any} 
              size={32} 
              color="#FFFFFF" 
            />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.productName}>{product.nom}</Text>
            <Text style={styles.categoryName}>{category?.nom}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.priceSection}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddToProject}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Ajouter à un projet</Text>
        </TouchableOpacity>
      </View>

      {/* Onglets */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'specs' && styles.activeTab]}
          onPress={() => setActiveTab('specs')}
        >
          <Text style={[styles.tabText, activeTab === 'specs' && styles.activeTabText]}>
            Spécifications
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'dimensions' && styles.activeTab]}
          onPress={() => setActiveTab('dimensions')}
        >
          <Text style={[styles.tabText, activeTab === 'dimensions' && styles.activeTabText]}>
            Dimensions
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
      </View>

      {/* Contenu des onglets */}
      {activeTab === 'specs' && renderSpecifications()}
      {activeTab === 'dimensions' && renderDimensions()}
      {activeTab === 'projects' && renderProjects()}
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
  },
  backButton: {
    marginBottom: theme.spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productIcon: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  headerText: {
    flex: 1,
  },
  productName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
  },
  categoryName: {
    fontSize: theme.typography.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: theme.spacing.xs,
  },
  productDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: theme.typography.lineHeight.sm,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    gap: theme.spacing.sm,
  },
  addButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.md,
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
  specSection: {
    marginBottom: theme.spacing.xl,
  },
  specSectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  specChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.round,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.xs,
  },
  specChipText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  dimensionCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  dimensionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  dimensionRow: {
    marginBottom: theme.spacing.lg,
  },
  dimensionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dimensionInfo: {
    marginLeft: theme.spacing.md,
  },
  dimensionLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  dimensionValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  dimensionNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  dimensionNoteText: {
    fontSize: theme.typography.fontSize.sm,
    color: '#FF6B35',
    flex: 1,
  },
  calculatorCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  calculatorTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  calculatorSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  calculatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  calculatorLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },

  quantityText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    minWidth: 30,
    textAlign: 'center',
  },

  projectsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
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
  projectClient: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  projectDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  emptyProjects: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    marginTop: theme.spacing.xl,
  },
  emptyProjectsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyProjectsText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
})); 