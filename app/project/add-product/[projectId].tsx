import React, { useState } from "react";
import { View, Text, Pressable, FlatList, TextInput } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Header } from "../../../components/Header";
import { SafeScrollView } from "../../../components/SafeScrollView";
import { LoadingState } from "../../../components/LoadingState";
import { useProducts, useProductCategories } from "../../../hooks/useSupabase";
import { Product, ProductCategory } from "../../../types";

export default function AddProductToProjectScreen() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { theme } = useUnistyles();
  const styles = stylesheet(theme);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: products, loading: productsLoading, error: productsError, refetch: refetchProducts } = useProducts();
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useProductCategories();

  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectProduct = (product: Product) => {
    router.push(`/project/configure-product/${projectId}/${product.id}`);
  };

  const renderCategoryFilter = () => (
    <View style={styles.categoryContainer}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[{ id: 'all', nom: 'Tous', description: '', icon: 'all' }, ...(categories || [])]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.categoryChip,
              (selectedCategory === item.id || (selectedCategory === null && item.id === 'all')) && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(item.id === 'all' ? null : item.id)}
          >
            <MaterialIcons
              name={getCategoryIcon(item.icon)}
              size={16}
              color={
                (selectedCategory === item.id || (selectedCategory === null && item.id === 'all'))
                  ? '#FFFFFF'
                  : theme.colors.textSecondary
              }
            />
            <Text
              style={[
                styles.categoryChipText,
                (selectedCategory === item.id || (selectedCategory === null && item.id === 'all')) && styles.categoryChipTextActive
              ]}
            >
              {item.nom}
            </Text>
          </Pressable>
        )}
        contentContainerStyle={styles.categoryList}
      />
    </View>
  );

  const renderProductItem = ({ item: product }: { item: Product }) => (
    <Pressable
      style={styles.productCard}
      onPress={() => handleSelectProduct(product)}
    >
      <View style={styles.productHeader}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.nom}</Text>
          <Text style={styles.productType}>{getProductTypeLabel(product.type)}</Text>
        </View>
        <MaterialIcons
          name="chevron-right"
          size={24}
          color={theme.colors.textSecondary}
        />
      </View>

      <Text style={styles.productDescription} numberOfLines={2}>
        {product.description}
      </Text>

      <View style={styles.productSpecs}>
        <View style={styles.specRow}>
          <MaterialIcons name="straighten" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.specText}>
            {product.dimensionsParDefaut.largeurMin}-{product.dimensionsParDefaut.largeurMax} ×{" "}
            {product.dimensionsParDefaut.hauteurMin}-{product.dimensionsParDefaut.hauteurMax} mm
          </Text>
        </View>
        <View style={styles.specRow}>
          <MaterialIcons name="palette" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.specText}>
            {product.specifications.materiaux.length} matériaux, {product.specifications.couleurs.length} couleurs
          </Text>
        </View>
      </View>
    </Pressable>
  );

  if (productsLoading || categoriesLoading) {
    return (
      <View style={styles.container}>
        <Header title="Ajouter un produit" showBackButton={true} />
        <LoadingState loading={true} error={null} onRetry={() => {}}>
          <></>
        </LoadingState>
      </View>
    );
  }

  if (productsError || categoriesError) {
    return (
      <View style={styles.container}>
        <Header title="Ajouter un produit" showBackButton={true} />
        <LoadingState
          loading={false}
          error={productsError || categoriesError || "Erreur de chargement"}
          onRetry={() => {
            refetchProducts();
          }}
        >
          <></>
        </LoadingState>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Ajouter un produit" showBackButton={true} />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un produit..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")} style={styles.clearButton}>
              <MaterialIcons name="clear" size={20} color={theme.colors.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>

      {renderCategoryFilter()}

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredProducts?.length || 0} produit{(filteredProducts?.length || 0) > 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="inventory" size={48} color={theme.colors.textSecondary} />
            <Text style={styles.emptyText}>
              {searchQuery || selectedCategory ? "Aucun produit trouvé" : "Aucun produit disponible"}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery || selectedCategory 
                ? "Essayez de modifier vos critères de recherche"
                : "Contactez votre administrateur pour ajouter des produits"
              }
            </Text>
          </View>
        }
      />
    </View>
  );
}

const getCategoryIcon = (icon: string): keyof typeof MaterialIcons.glyphMap => {
  const iconMap: Record<string, keyof typeof MaterialIcons.glyphMap> = {
    'all': 'apps',
    'fenetre': 'window',
    'porte': 'door-front',
    'portail': 'fence',
    'volet': 'view-module',
    'package': 'inventory',
  };
  return iconMap[icon] || 'inventory';
};

const getProductTypeLabel = (type: Product["type"]): string => {
  const typeLabels = {
    fenetre: "Fenêtre",
    porte: "Porte",
    portail: "Portail",
    volet: "Volet",
  };
  return typeLabels[type] || type;
};

const stylesheet = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    searchContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    searchInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
    },
    searchIcon: {
      marginRight: theme.spacing.sm,
    },
    searchInput: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
    },
    clearButton: {
      padding: theme.spacing.xs,
    },
    categoryContainer: {
      backgroundColor: theme.colors.surface,
      paddingBottom: theme.spacing.md,
    },
    categoryList: {
      paddingHorizontal: theme.spacing.lg,
    },
    categoryChip: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginRight: theme.spacing.sm,
      borderRadius: theme.radius.round,
      backgroundColor: theme.colors.surfaceVariant,
      gap: theme.spacing.xs,
    },
    categoryChipActive: {
      backgroundColor: theme.colors.primary,
    },
    categoryChipText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      fontWeight: theme.typography.fontWeight.medium,
    },
    categoryChipTextActive: {
      color: "#FFFFFF",
    },
    resultsContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    resultsText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      fontWeight: theme.typography.fontWeight.medium,
    },
    productsList: {
      padding: theme.spacing.lg,
    },
    productCard: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    productHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: theme.spacing.sm,
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
    productType: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeight.medium,
    },
    productDescription: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      lineHeight: theme.typography.lineHeight.sm,
      marginBottom: theme.spacing.md,
    },
    productSpecs: {
      gap: theme.spacing.sm,
    },
    specRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    specText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: theme.spacing.xl * 2,
      paddingHorizontal: theme.spacing.lg,
    },
    emptyText: {
      fontSize: theme.typography.fontSize.lg,
      color: theme.colors.text,
      fontWeight: theme.typography.fontWeight.medium,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
      textAlign: "center",
    },
    emptySubtext: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: theme.typography.lineHeight.md,
    },
  });