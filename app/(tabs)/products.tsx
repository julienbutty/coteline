import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { products, productCategories } from '../../data/mockData';

export default function ProductsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.categoryId === selectedCategory)
    : products;

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}` as any);
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'fenêtres': return 'albums-outline';
      case 'portes': return 'exit-outline';
      case 'portails': return 'grid-outline';
      case 'volets': return 'layers-outline';
      default: return 'square-outline';
    }
  };

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'fenetre': return 'albums-outline';
      case 'porte': return 'exit-outline';
      case 'portail': return 'grid-outline';
      case 'volet': return 'layers-outline';
      default: return 'square-outline';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Catalogue Produits</Text>
        <Text style={styles.subtitle}>
          {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
        </Text>
      </View>

      {/* Filtres par catégorie */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[styles.filterChip, !selectedCategory && styles.filterChipActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.filterText, !selectedCategory && styles.filterTextActive]}>
              Tous
            </Text>
          </TouchableOpacity>
          
          {productCategories.map((category) => (
            <TouchableOpacity 
              key={category.id}
              style={[styles.filterChip, selectedCategory === category.id && styles.filterChipActive]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons 
                name={getCategoryIcon(category.nom) as any} 
                size={16} 
                color={selectedCategory === category.id ? '#FFFFFF' : '#666'} 
                style={styles.filterIcon}
              />
              <Text style={[styles.filterText, selectedCategory === category.id && styles.filterTextActive]}>
                {category.nom}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Liste des produits */}
      <View style={styles.productsContainer}>
        {filteredProducts.map((product) => {
          const category = productCategories.find(c => c.id === product.categoryId);
          return (
            <TouchableOpacity 
              key={product.id}
              style={styles.productCard}
              onPress={() => handleProductPress(product.id)}
            >
              <View style={styles.productHeader}>
                <View style={styles.productIcon}>
                  <Ionicons 
                    name={getProductIcon(product.type) as any} 
                    size={24} 
                    color="#2F22CF" 
                  />
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.nom}</Text>
                  <Text style={styles.productDescription}>{product.description}</Text>
                </View>
                <View style={styles.productCategory}>
                  <Text style={styles.productType}>{category?.nom}</Text>
                </View>
              </View>

            <View style={styles.productSpecs}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Matériaux:</Text>
                <Text style={styles.specValue}>
                  {product.specifications.materiaux?.slice(0, 2).join(', ')}
                  {(product.specifications.materiaux?.length || 0) > 2 && '...'}
                </Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Dimensions:</Text>
                <Text style={styles.specValue}>
                  {product.dimensionsParDefaut.largeurMin}-{product.dimensionsParDefaut.largeurMax} × {product.dimensionsParDefaut.hauteurMin}-{product.dimensionsParDefaut.hauteurMax}mm
                </Text>
              </View>
            </View>

            <View style={styles.productFooter}>
              <View style={styles.productTags}>
                {product.specifications.couleurs?.slice(0, 3).map((color, index) => (
                  <View key={index} style={styles.colorTag}>
                    <Text style={styles.colorText}>{color}</Text>
                  </View>
                ))}
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>
          );
        })}
      </View>

      {filteredProducts.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={48} color="#CCC" />
          <Text style={styles.emptyTitle}>Aucun produit trouvé</Text>
          <Text style={styles.emptyText}>
            Essayez de sélectionner une autre catégorie
          </Text>
        </View>
      )}
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
  filtersContainer: {
    paddingVertical: theme.spacing.md,
    paddingLeft: theme.spacing.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.round,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterIcon: {
    marginRight: theme.spacing.xs,
  },
  filterText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  productsContainer: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  productCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  productIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(47, 34, 207, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  productDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.sm,
  },
  productCategory: {
    alignItems: 'flex-end',
  },
  productType: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary,
  },

  productSpecs: {
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
    width: 80,
  },
  specValue: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text,
    flex: 1,
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productTags: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  colorTag: {
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
  colorText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    marginTop: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
})); 