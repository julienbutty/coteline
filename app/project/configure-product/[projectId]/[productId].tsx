import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, TextInput, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Header } from "../../../../components/Header";
import { LoadingState } from "../../../../components/LoadingState";
import { useProduct } from "../../../../hooks/useSupabase";
import { ProjectService } from "../../../../services";
import { ProjectProduct, Product } from "../../../../types";

// Fonction pour obtenir les plages appropriées selon le type de produit
const getDimensionRanges = (productType: Product["type"], defaultDimensions: Product["dimensionsParDefaut"]) => {
  const baseRanges = {
    fenetre: {
      largeur: { min: Math.max(300, defaultDimensions.largeurMin), max: Math.min(3000, defaultDimensions.largeurMax), step: 1 },
      hauteur: { min: Math.max(400, defaultDimensions.hauteurMin), max: Math.min(2500, defaultDimensions.hauteurMax), step: 1 },
      profondeur: { min: 40, max: 200, step: 1 }
    },
    porte: {
      largeur: { min: Math.max(600, defaultDimensions.largeurMin), max: Math.min(2500, defaultDimensions.largeurMax), step: 1 },
      hauteur: { min: Math.max(1800, defaultDimensions.hauteurMin), max: Math.min(2800, defaultDimensions.hauteurMax), step: 1 },
      profondeur: { min: 40, max: 300, step: 1 }
    },
    portail: {
      largeur: { min: Math.max(1000, defaultDimensions.largeurMin), max: Math.min(6000, defaultDimensions.largeurMax), step: 1 },
      hauteur: { min: Math.max(1000, defaultDimensions.hauteurMin), max: Math.min(3000, defaultDimensions.hauteurMax), step: 1 },
      profondeur: { min: 50, max: 400, step: 1 }
    },
    volet: {
      largeur: { min: Math.max(200, defaultDimensions.largeurMin), max: Math.min(2000, defaultDimensions.largeurMax), step: 1 },
      hauteur: { min: Math.max(400, defaultDimensions.hauteurMin), max: Math.min(3000, defaultDimensions.hauteurMax), step: 1 },
      profondeur: { min: 20, max: 100, step: 1 }
    }
  };

  return baseRanges[productType] || baseRanges.fenetre;
};

export default function ConfigureProductScreen() {
  const { projectId, productId } = useLocalSearchParams<{ projectId: string; productId: string }>();
  const { theme } = useUnistyles();
  const styles = stylesheet(theme);

  const { data: product, loading, error, refetch } = useProduct(productId as string);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    quantite: 1,
    dimensions: {
      largeur: 0,
      hauteur: 0,
      profondeur: 0,
    },
    parametres: {
      materiau: "",
      couleur: "",
      vitrage: "",
      ouverture: "",
      options: [] as string[],
    },
    notes: "",
  });

  const handleSubmit = async () => {
    if (!product || !projectId) return;

    // Validation des dimensions obligatoires
    if (formData.dimensions.largeur <= 0) {
      Alert.alert("Mesures manquantes", "Veuillez renseigner la largeur exacte");
      return;
    }

    if (formData.dimensions.hauteur <= 0) {
      Alert.alert("Mesures manquantes", "Veuillez renseigner la hauteur exacte");
      return;
    }

    // Validation des contraintes produit avec plages dynamiques
    const ranges = getDimensionRanges(product.type, product.dimensionsParDefaut);
    
    if (formData.dimensions.largeur < ranges.largeur.min || 
        formData.dimensions.largeur > ranges.largeur.max) {
      Alert.alert(
        "Dimensions hors contraintes",
        `La largeur doit être entre ${ranges.largeur.min} et ${ranges.largeur.max} mm pour ce type de ${product.type}`
      );
      return;
    }

    if (formData.dimensions.hauteur < ranges.hauteur.min || 
        formData.dimensions.hauteur > ranges.hauteur.max) {
      Alert.alert(
        "Dimensions hors contraintes",
        `La hauteur doit être entre ${ranges.hauteur.min} et ${ranges.hauteur.max} mm pour ce type de ${product.type}`
      );
      return;
    }

    // Validation des paramètres obligatoires
    if (!formData.parametres.materiau) {
      Alert.alert("Paramètres manquants", "Veuillez sélectionner un matériau");
      return;
    }

    if (!formData.parametres.couleur) {
      Alert.alert("Paramètres manquants", "Veuillez sélectionner une couleur");
      return;
    }

    setIsSubmitting(true);

    try {
      const projectProductData: Omit<ProjectProduct, "id" | "product" | "createdAt" | "updatedAt"> = {
        projectId: projectId,
        productId: product.id,
        quantite: formData.quantite,
        dimensions: formData.dimensions,
        parametres: formData.parametres,
        notes: formData.notes || undefined,
        statut: "brouillon",
      };

      await ProjectService.addProductToProject(projectProductData);

      Alert.alert(
        "Produit configuré avec succès",
        `${product.nom} a été ajouté au projet avec ses mesures et paramètres.`,
        [
          {
            text: "Retour au projet",
            onPress: () => router.replace(`/project/${projectId}`),
          },
        ]
      );
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit:", error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de l'ajout du produit"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDimensionsSection = () => {
    if (!product) return null;
    
    const ranges = getDimensionRanges(product.type, product.dimensionsParDefaut);
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mesures précises (mm)</Text>
        <Text style={styles.sectionSubtitle}>
          Sélectionnez les dimensions exactes relevées sur site.{'\n'}
          Contraintes {product.type} - Largeur: {ranges.largeur.min}-{ranges.largeur.max} mm • 
          Hauteur: {ranges.hauteur.min}-{ranges.hauteur.max} mm
        </Text>

        <View style={styles.dimensionsContainer}>
          <View style={styles.dimensionInputContainer}>
            <Text style={styles.dimensionLabel}>Largeur exacte *</Text>
            <TextInput
              style={styles.dimensionInput}
              value={formData.dimensions.largeur?.toString() || ''}
              onChangeText={(text) => {
                const value = parseFloat(text) || 0;
                setFormData(prev => ({
                  ...prev,
                  dimensions: { ...prev.dimensions, largeur: value }
                }));
              }}
              placeholder="Largeur en mm"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.dimensionInputContainer}>
            <Text style={styles.dimensionLabel}>Hauteur exacte *</Text>
            <TextInput
              style={styles.dimensionInput}
              value={formData.dimensions.hauteur?.toString() || ''}
              onChangeText={(text) => {
                const value = parseFloat(text) || 0;
                setFormData(prev => ({
                  ...prev,
                  dimensions: { ...prev.dimensions, hauteur: value }
                }));
              }}
              placeholder="Hauteur en mm"
              keyboardType="numeric"
            />
          </View>
        </View>

        {(product?.type === "porte" || product?.type === "fenetre") && (
          <View style={styles.profondeurContainer}>
            <View style={styles.dimensionInputContainer}>
              <Text style={styles.dimensionLabel}>Profondeur (optionnel)</Text>
              <TextInput
                style={styles.dimensionInput}
                value={formData.dimensions.profondeur?.toString() || ''}
                onChangeText={(text) => {
                  const value = parseFloat(text) || 0;
                  setFormData(prev => ({
                    ...prev,
                    dimensions: { ...prev.dimensions, profondeur: value }
                  }));
                }}
                placeholder="Profondeur en mm"
                keyboardType="numeric"
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderParametersSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Paramètres</Text>

      {/* Matériau */}
      <View style={styles.parameterGroup}>
        <Text style={styles.parameterLabel}>Matériau *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
          {product?.specifications.materiaux.map((materiau) => (
            <Pressable
              key={materiau}
              style={[
                styles.optionChip,
                formData.parametres.materiau === materiau && styles.optionChipSelected
              ]}
              onPress={() => setFormData(prev => ({
                ...prev,
                parametres: { ...prev.parametres, materiau }
              }))}
            >
              <Text
                style={[
                  styles.optionChipText,
                  formData.parametres.materiau === materiau && styles.optionChipTextSelected
                ]}
              >
                {materiau}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Couleur */}
      <View style={styles.parameterGroup}>
        <Text style={styles.parameterLabel}>Couleur *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
          {product?.specifications.couleurs.map((couleur) => (
            <Pressable
              key={couleur}
              style={[
                styles.optionChip,
                formData.parametres.couleur === couleur && styles.optionChipSelected
              ]}
              onPress={() => setFormData(prev => ({
                ...prev,
                parametres: { ...prev.parametres, couleur }
              }))}
            >
              <Text
                style={[
                  styles.optionChipText,
                  formData.parametres.couleur === couleur && styles.optionChipTextSelected
                ]}
              >
                {couleur}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Vitrage (pour fenêtres) */}
      {product?.specifications.typesVitrage && product.specifications.typesVitrage.length > 0 && (
        <View style={styles.parameterGroup}>
          <Text style={styles.parameterLabel}>Type de vitrage</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
            {product.specifications.typesVitrage.map((vitrage) => (
              <Pressable
                key={vitrage}
                style={[
                  styles.optionChip,
                  formData.parametres.vitrage === vitrage && styles.optionChipSelected
                ]}
                onPress={() => setFormData(prev => ({
                  ...prev,
                  parametres: { ...prev.parametres, vitrage }
                }))}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    formData.parametres.vitrage === vitrage && styles.optionChipTextSelected
                  ]}
                >
                  {vitrage}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Système d'ouverture */}
      {product?.specifications.systemeOuverture && product.specifications.systemeOuverture.length > 0 && (
        <View style={styles.parameterGroup}>
          <Text style={styles.parameterLabel}>Système d'ouverture</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
            {product.specifications.systemeOuverture.map((ouverture) => (
              <Pressable
                key={ouverture}
                style={[
                  styles.optionChip,
                  formData.parametres.ouverture === ouverture && styles.optionChipSelected
                ]}
                onPress={() => setFormData(prev => ({
                  ...prev,
                  parametres: { ...prev.parametres, ouverture }
                }))}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    formData.parametres.ouverture === ouverture && styles.optionChipTextSelected
                  ]}
                >
                  {ouverture}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Ajout et prise de mesures" showBackButton={true} />
        <LoadingState loading={true} error={null} onRetry={refetch}>
          <></>
        </LoadingState>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.container}>
        <Header title="Ajout et prise de mesures" showBackButton={true} />
        <LoadingState
          loading={false}
          error={error || "Produit introuvable"}
          onRetry={refetch}
        >
          <></>
        </LoadingState>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Ajout et prise de mesures" showBackButton={true} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Info produit */}
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{product.nom}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
        </View>

        {/* Quantité */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantité</Text>
          <View style={styles.quantityContainer}>
            <Pressable
              style={styles.quantityButton}
              onPress={() => setFormData(prev => ({
                ...prev,
                quantite: Math.max(1, prev.quantite - 1)
              }))}
            >
              <MaterialIcons name="remove" size={20} color={theme.colors.text} />
            </Pressable>
            
            <TextInput
              style={styles.quantityInput}
              value={formData.quantite.toString()}
              onChangeText={(text) => {
                const value = Math.max(1, parseInt(text) || 1);
                setFormData(prev => ({ ...prev, quantite: value }));
              }}
              keyboardType="numeric"
              textAlign="center"
            />
            
            <Pressable
              style={styles.quantityButton}
              onPress={() => setFormData(prev => ({
                ...prev,
                quantite: prev.quantite + 1
              }))}
            >
              <MaterialIcons name="add" size={20} color={theme.colors.text} />
            </Pressable>
          </View>
        </View>

        {renderDimensionsSection()}
        {renderParametersSection()}

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observations chantier (optionnel)</Text>
          <TextInput
            style={styles.notesInput}
            value={formData.notes}
            onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
            placeholder="Contraintes particulières, finitions spéciales, remarques techniques..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Pressable
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Text style={styles.submitButtonText}>Ajout en cours...</Text>
          ) : (
            <>
              <MaterialIcons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Finaliser l'ajout</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const stylesheet = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    productHeader: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    productName: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    productDescription: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.textSecondary,
      lineHeight: theme.typography.lineHeight.md,
    },
    section: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
      marginTop: theme.spacing.sm,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    sectionSubtitle: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
    },
    quantityContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.md,
    },
    quantityButton: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surfaceVariant,
      alignItems: "center",
      justifyContent: "center",
    },
    quantityInput: {
      width: 80,
      textAlign: "center",
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
      backgroundColor: theme.colors.surfaceVariant,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
    },
    dimensionsContainer: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    dimensionInputContainer: {
      flex: 1,
    },
    dimensionLabel: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    dimensionInput: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
    },
    profondeurContainer: {
      marginTop: theme.spacing.md,
    },
    parameterGroup: {
      marginBottom: theme.spacing.lg,
    },
    parameterLabel: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    optionsContainer: {
      flexDirection: "row",
    },
    optionChip: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.round,
      backgroundColor: theme.colors.surfaceVariant,
      marginRight: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    optionChipSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    optionChipText: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text,
    },
    optionChipTextSelected: {
      color: "#FFFFFF",
    },
    notesInput: {
      backgroundColor: theme.colors.surfaceVariant,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      minHeight: 100,
    },
    actionsContainer: {
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radius.md,
      gap: theme.spacing.sm,
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonText: {
      color: "#FFFFFF",
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semibold,
    },
  });