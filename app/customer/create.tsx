import React, { useState } from "react";
import { Text, View, TextInput, Pressable, Alert } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { router, useFocusEffect } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Header } from "../../components/Header";
import { SafeScrollView } from "../../components/SafeScrollView";
import { useCreateClient } from "../../hooks/useSupabase";
import { clientEvents } from "../../utils/eventEmitter";
import { Client } from "../../types";

interface ClientFormData {
  nom: string;
  prenom: string;
  entreprise: string;
  email: string;
  telephone: string;
  adresse: {
    rue: string;
    ville: string;
    codePostal: string;
    pays: string;
  };
  notes: string;
}

interface FormErrors {
  nom?: string;
  email?: string;
  telephone?: string;
  adresse?: {
    rue?: string;
    ville?: string;
    codePostal?: string;
  };
}

export default function CreateCustomerScreen() {
  const { theme } = useUnistyles();
  const styles = stylesheet(theme);
  const {
    createClient,
    loading: isSubmitting,
    error: submitError,
  } = useCreateClient();

  const [formData, setFormData] = useState<ClientFormData>({
    nom: "",
    prenom: "",
    entreprise: "",
    email: "",
    telephone: "",
    adresse: {
      rue: "",
      ville: "",
      codePostal: "",
      pays: "France",
    },
    notes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Validation des champs
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Nom obligatoire
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est obligatoire";
    }

    // Email obligatoire et format valide
    if (!formData.email.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    // Téléphone obligatoire
    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le téléphone est obligatoire";
    }

    // Adresse
    if (!formData.adresse.rue.trim()) {
      newErrors.adresse = {
        ...newErrors.adresse,
        rue: "La rue est obligatoire",
      };
    }
    if (!formData.adresse.ville.trim()) {
      newErrors.adresse = {
        ...newErrors.adresse,
        ville: "La ville est obligatoire",
      };
    }
    if (!formData.adresse.codePostal.trim()) {
      newErrors.adresse = {
        ...newErrors.adresse,
        codePostal: "Le code postal est obligatoire",
      };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Mise à jour des champs
  const updateField = (field: keyof ClientFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const updateAddressField = (
    field: keyof ClientFormData["adresse"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      adresse: { ...prev.adresse, [field]: value },
    }));
    // Effacer l'erreur du champ d'adresse modifié
    if (errors.adresse?.[field]) {
      setErrors((prev) => ({
        ...prev,
        adresse: { ...prev.adresse, [field]: undefined },
      }));
    }
  };

  // Soumission du formulaire
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const clientData: Omit<
        Client,
        "id" | "createdAt" | "updatedAt" | "projets"
      > = {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim() || undefined,
        entreprise: formData.entreprise.trim() || undefined,
        email: formData.email.trim(),
        telephone: formData.telephone.trim(),
        adresse: {
          rue: formData.adresse.rue.trim(),
          ville: formData.adresse.ville.trim(),
          codePostal: formData.adresse.codePostal.trim(),
          pays: formData.adresse.pays.trim(),
        },
        notes: formData.notes.trim() || undefined,
      };

      const newClient = await createClient(clientData);

      if (newClient) {
        // Émettre l'événement de création pour rafraîchir les listes
        clientEvents.created(newClient);

        Alert.alert("Succès", "Le client a été créé avec succès", [
          {
            text: "Voir le client",
            onPress: () => router.replace(`/customer/${newClient.id}`),
          },
          {
            text: "Retour à la liste",
            onPress: () => router.back(),
          },
        ]);
      } else if (submitError) {
        Alert.alert("Erreur", submitError);
      }
    } catch (error) {
      Alert.alert(
        "Erreur",
        error instanceof Error
          ? error.message
          : "Erreur lors de la création du client"
      );
    }
  };

  return (
    <>
      <Header
        title="Nouveau Client"
        subtitle="Ajouter un client à votre carnet d'adresses"
        showBackButton={true}
        rightComponent={
          <Pressable
            style={[
              styles.saveButton,
              isSubmitting && styles.saveButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <MaterialIcons
              name="check"
              size={20}
              color={
                isSubmitting ? theme.colors.textTertiary : theme.colors.surface
              }
            />
          </Pressable>
        }
      />

      <SafeScrollView style={styles.container}>
        {/* Informations personnelles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom *</Text>
            <TextInput
              style={[styles.input, errors.nom && styles.inputError]}
              value={formData.nom}
              onChangeText={(value) => updateField("nom", value)}
              placeholder="Nom du client"
              placeholderTextColor={theme.colors.textTertiary}
            />
            {errors.nom && <Text style={styles.errorText}>{errors.nom}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prénom</Text>
            <TextInput
              style={styles.input}
              value={formData.prenom}
              onChangeText={(value) => updateField("prenom", value)}
              placeholder="Prénom du client"
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Entreprise</Text>
            <TextInput
              style={styles.input}
              value={formData.entreprise}
              onChangeText={(value) => updateField("entreprise", value)}
              placeholder="Nom de l'entreprise (optionnel)"
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={formData.email}
              onChangeText={(value) => updateField("email", value)}
              placeholder="email@exemple.com"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Téléphone *</Text>
            <TextInput
              style={[styles.input, errors.telephone && styles.inputError]}
              value={formData.telephone}
              onChangeText={(value) => updateField("telephone", value)}
              placeholder="06 12 34 56 78"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="phone-pad"
            />
            {errors.telephone && (
              <Text style={styles.errorText}>{errors.telephone}</Text>
            )}
          </View>
        </View>

        {/* Adresse */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adresse</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Rue *</Text>
            <TextInput
              style={[styles.input, errors.adresse?.rue && styles.inputError]}
              value={formData.adresse.rue}
              onChangeText={(value) => updateAddressField("rue", value)}
              placeholder="123 rue de la Paix"
              placeholderTextColor={theme.colors.textTertiary}
            />
            {errors.adresse?.rue && (
              <Text style={styles.errorText}>{errors.adresse.rue}</Text>
            )}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>Code postal *</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.adresse?.codePostal && styles.inputError,
                ]}
                value={formData.adresse.codePostal}
                onChangeText={(value) =>
                  updateAddressField("codePostal", value)
                }
                placeholder="75001"
                placeholderTextColor={theme.colors.textTertiary}
                keyboardType="numeric"
              />
              {errors.adresse?.codePostal && (
                <Text style={styles.errorText}>
                  {errors.adresse.codePostal}
                </Text>
              )}
            </View>

            <View style={[styles.inputGroup, styles.flex2]}>
              <Text style={styles.label}>Ville *</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.adresse?.ville && styles.inputError,
                ]}
                value={formData.adresse.ville}
                onChangeText={(value) => updateAddressField("ville", value)}
                placeholder="Paris"
                placeholderTextColor={theme.colors.textTertiary}
              />
              {errors.adresse?.ville && (
                <Text style={styles.errorText}>{errors.adresse.ville}</Text>
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pays</Text>
            <TextInput
              style={styles.input}
              value={formData.adresse.pays}
              onChangeText={(value) => updateAddressField("pays", value)}
              placeholder="France"
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes additionnelles</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(value) => updateField("notes", value)}
              placeholder="Informations complémentaires..."
              placeholderTextColor={theme.colors.textTertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Bouton de création */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.createButton,
              isSubmitting && styles.createButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <MaterialIcons
              name={isSubmitting ? "hourglass-empty" : "person-add"}
              size={20}
              color={theme.colors.surface}
            />
            <Text style={styles.createButtonText}>
              {isSubmitting ? "Création en cours..." : "Créer le client"}
            </Text>
          </Pressable>
        </View>
      </SafeScrollView>
    </>
  );
}

const stylesheet = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    section: {
      backgroundColor: theme.colors.surface,
      marginBottom: theme.spacing.sm,
      padding: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    inputGroup: {
      marginBottom: theme.spacing.md,
    },
    label: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    textArea: {
      height: 100,
    },
    errorText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
    },
    row: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    flex1: {
      flex: 1,
    },
    flex2: {
      flex: 2,
    },
    saveButton: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    saveButtonDisabled: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    buttonContainer: {
      padding: theme.spacing.lg,
    },
    createButton: {
      backgroundColor: theme.colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radius.md,
      gap: theme.spacing.sm,
    },
    createButtonDisabled: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    createButtonText: {
      color: theme.colors.surface,
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.medium,
    },
  });
