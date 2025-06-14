import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Header } from "../../components/Header";
import { useClients, useCreateProject } from "../../hooks/useSupabase";
import { projectEvents } from "../../utils/eventEmitter";
import { Project, Client } from "../../types";

interface ProjectFormData {
  nom: string;
  description: string;
  clientId: string;
  statut: "brouillon" | "en_cours" | "termine" | "annule";
  adresseChantier: {
    rue: string;
    ville: string;
    codePostal: string;
    pays: string;
  };
  dateDebutPrevue: string;
  dateFinPrevue: string;
  notes: string;
  tags: string[];
}

interface FormErrors {
  nom?: string;
  clientId?: string;
  adresseChantier?: {
    rue?: string;
    ville?: string;
    codePostal?: string;
  };
}

export default function CreateProjectScreen() {
  const { theme } = useUnistyles();
  const styles = stylesheet(theme);
  const { data: clients } = useClients();
  const {
    createProject,
    loading: isSubmitting,
    error: submitError,
  } = useCreateProject();

  const [formData, setFormData] = useState<ProjectFormData>({
    nom: "",
    description: "",
    clientId: "",
    statut: "brouillon",
    adresseChantier: {
      rue: "",
      ville: "",
      codePostal: "",
      pays: "France",
    },
    dateDebutPrevue: "",
    dateFinPrevue: "",
    notes: "",
    tags: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showClientSelector, setShowClientSelector] = useState(false);
  const [clientSearch, setClientSearch] = useState("");

  // Validation des champs
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Nom obligatoire
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom du projet est obligatoire";
    }

    // Client obligatoire
    if (!formData.clientId) {
      newErrors.clientId = "Veuillez sélectionner un client";
    }

    // Adresse chantier (optionnelle mais si remplie, doit être complète)
    if (
      formData.adresseChantier.rue ||
      formData.adresseChantier.ville ||
      formData.adresseChantier.codePostal
    ) {
      if (!formData.adresseChantier.rue.trim()) {
        newErrors.adresseChantier = {
          ...newErrors.adresseChantier,
          rue: "La rue est obligatoire",
        };
      }
      if (!formData.adresseChantier.ville.trim()) {
        newErrors.adresseChantier = {
          ...newErrors.adresseChantier,
          ville: "La ville est obligatoire",
        };
      }
      if (!formData.adresseChantier.codePostal.trim()) {
        newErrors.adresseChantier = {
          ...newErrors.adresseChantier,
          codePostal: "Le code postal est obligatoire",
        };
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Mise à jour des champs
  const updateField = (field: keyof ProjectFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const updateAddressField = (
    field: keyof ProjectFormData["adresseChantier"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      adresseChantier: { ...prev.adresseChantier, [field]: value },
    }));
    // Effacer l'erreur du champ d'adresse modifié
    if (errors.adresseChantier?.[field]) {
      setErrors((prev) => ({
        ...prev,
        adresseChantier: { ...prev.adresseChantier, [field]: undefined },
      }));
    }
  };

  // Sélection du client
  const selectClient = (client: Client) => {
    setFormData((prev) => ({ ...prev, clientId: client.id }));
    setShowClientSelector(false);
    setClientSearch("");
    // Effacer l'erreur client
    if (errors.clientId) {
      setErrors((prev) => ({ ...prev, clientId: undefined }));
    }
  };

  // Clients filtrés pour la recherche
  const filteredClients = clients.filter((client) => {
    const searchLower = clientSearch.toLowerCase();
    const fullName = `${client.prenom || ""} ${client.nom}`.toLowerCase();
    const company = (client.entreprise || "").toLowerCase();
    return fullName.includes(searchLower) || company.includes(searchLower);
  });

  // Client sélectionné
  const selectedClient = clients.find((c) => c.id === formData.clientId);

  // Soumission du formulaire
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const projectData: Omit<
        Project,
        "id" | "client" | "produits" | "createdAt" | "updatedAt"
      > = {
        nom: formData.nom.trim(),
        description: formData.description.trim() || undefined,
        clientId: formData.clientId,
        statut: formData.statut,
        adresseChantier:
          formData.adresseChantier.rue ||
          formData.adresseChantier.ville ||
          formData.adresseChantier.codePostal
            ? {
                rue: formData.adresseChantier.rue.trim(),
                ville: formData.adresseChantier.ville.trim(),
                codePostal: formData.adresseChantier.codePostal.trim(),
                pays: formData.adresseChantier.pays.trim(),
              }
            : undefined,
        dateDebutPrevue: formData.dateDebutPrevue
          ? new Date(formData.dateDebutPrevue)
          : undefined,
        dateFinPrevue: formData.dateFinPrevue
          ? new Date(formData.dateFinPrevue)
          : undefined,
        notes: formData.notes.trim() || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
      };

      const newProject = await createProject(projectData);

      if (newProject) {
        // Émettre l'événement de création pour rafraîchir les listes
        projectEvents.created(newProject);

        Alert.alert("Succès", "Le projet a été créé avec succès", [
          {
            text: "Voir le projet",
            onPress: () => router.replace(`/project/${newProject.id}`),
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
          : "Erreur lors de la création du projet"
      );
    }
  };

  return (
    <>
      <Header
        title="Nouveau Projet"
        subtitle="Créer un projet pour un client"
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

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Informations générales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations générales</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom du projet *</Text>
            <TextInput
              style={[styles.input, errors.nom && styles.inputError]}
              value={formData.nom}
              onChangeText={(value) => updateField("nom", value)}
              placeholder="Ex: Rénovation fenêtres salon"
              placeholderTextColor={theme.colors.textTertiary}
            />
            {errors.nom && <Text style={styles.errorText}>{errors.nom}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => updateField("description", value)}
              placeholder="Description détaillée du projet..."
              placeholderTextColor={theme.colors.textTertiary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Statut</Text>
            <View style={styles.statusContainer}>
              {(["brouillon", "en_cours", "termine", "annule"] as const).map(
                (status) => (
                  <Pressable
                    key={status}
                    style={[
                      styles.statusOption,
                      formData.statut === status && styles.statusOptionSelected,
                    ]}
                    onPress={() => updateField("statut", status)}
                  >
                    <Text
                      style={[
                        styles.statusOptionText,
                        formData.statut === status &&
                          styles.statusOptionTextSelected,
                      ]}
                    >
                      {status === "brouillon"
                        ? "Brouillon"
                        : status === "en_cours"
                        ? "En cours"
                        : status === "termine"
                        ? "Terminé"
                        : "Annulé"}
                    </Text>
                  </Pressable>
                )
              )}
            </View>
          </View>
        </View>

        {/* Sélection du client */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client *</Text>

          {selectedClient ? (
            <View style={styles.selectedClient}>
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>
                  {selectedClient.entreprise ||
                    `${selectedClient.prenom} ${selectedClient.nom}`}
                </Text>
                <Text style={styles.clientEmail}>{selectedClient.email}</Text>
              </View>
              <Pressable
                style={styles.changeClientButton}
                onPress={() => setShowClientSelector(true)}
              >
                <MaterialIcons
                  name="edit"
                  size={20}
                  color={theme.colors.primary}
                />
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={[
                styles.selectClientButton,
                errors.clientId && styles.inputError,
              ]}
              onPress={() => setShowClientSelector(true)}
            >
              <MaterialIcons
                name="person-add"
                size={20}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.selectClientText}>
                Sélectionner un client
              </Text>
            </Pressable>
          )}
          {errors.clientId && (
            <Text style={styles.errorText}>{errors.clientId}</Text>
          )}
        </View>

        {/* Adresse du chantier */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Adresse du chantier (optionnel)
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Rue</Text>
            <TextInput
              style={[
                styles.input,
                errors.adresseChantier?.rue && styles.inputError,
              ]}
              value={formData.adresseChantier.rue}
              onChangeText={(value) => updateAddressField("rue", value)}
              placeholder="123 rue de la Paix"
              placeholderTextColor={theme.colors.textTertiary}
            />
            {errors.adresseChantier?.rue && (
              <Text style={styles.errorText}>{errors.adresseChantier.rue}</Text>
            )}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>Code postal</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.adresseChantier?.codePostal && styles.inputError,
                ]}
                value={formData.adresseChantier.codePostal}
                onChangeText={(value) =>
                  updateAddressField("codePostal", value)
                }
                placeholder="75001"
                placeholderTextColor={theme.colors.textTertiary}
                keyboardType="numeric"
              />
              {errors.adresseChantier?.codePostal && (
                <Text style={styles.errorText}>
                  {errors.adresseChantier.codePostal}
                </Text>
              )}
            </View>

            <View style={[styles.inputGroup, styles.flex2]}>
              <Text style={styles.label}>Ville</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.adresseChantier?.ville && styles.inputError,
                ]}
                value={formData.adresseChantier.ville}
                onChangeText={(value) => updateAddressField("ville", value)}
                placeholder="Paris"
                placeholderTextColor={theme.colors.textTertiary}
              />
              {errors.adresseChantier?.ville && (
                <Text style={styles.errorText}>
                  {errors.adresseChantier.ville}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pays</Text>
            <TextInput
              style={styles.input}
              value={formData.adresseChantier.pays}
              onChangeText={(value) => updateAddressField("pays", value)}
              placeholder="France"
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>
        </View>

        {/* Dates et planning */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Planning (optionnel)</Text>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>Date de début prévue</Text>
              <TextInput
                style={styles.input}
                value={formData.dateDebutPrevue}
                onChangeText={(value) => updateField("dateDebutPrevue", value)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.colors.textTertiary}
              />
            </View>

            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>Date de fin prévue</Text>
              <TextInput
                style={styles.input}
                value={formData.dateFinPrevue}
                onChangeText={(value) => updateField("dateFinPrevue", value)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.colors.textTertiary}
              />
            </View>
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
              placeholder="Informations complémentaires, contraintes, remarques..."
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
              name={isSubmitting ? "hourglass-empty" : "add"}
              size={20}
              color={theme.colors.surface}
            />
            <Text style={styles.createButtonText}>
              {isSubmitting ? "Création en cours..." : "Créer le projet"}
            </Text>
          </Pressable>
        </View>

        {/* Modal de sélection de client */}
        {showClientSelector && (
          <View style={styles.clientSelector}>
            <View style={styles.clientSelectorHeader}>
              <Text style={styles.clientSelectorTitle}>Choisir un client</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setShowClientSelector(false)}
              >
                <MaterialIcons
                  name="close"
                  size={24}
                  color={theme.colors.text}
                />
              </Pressable>
            </View>

            <TextInput
              style={styles.searchInput}
              value={clientSearch}
              onChangeText={setClientSearch}
              placeholder="Rechercher un client..."
              placeholderTextColor={theme.colors.textTertiary}
            />

            <ScrollView style={styles.clientList}>
              {filteredClients.map((client) => (
                <Pressable
                  key={client.id}
                  style={styles.clientOption}
                  onPress={() => selectClient(client)}
                >
                  <Text style={styles.clientOptionName}>
                    {client.entreprise || `${client.prenom} ${client.nom}`}
                  </Text>
                  <Text style={styles.clientOptionEmail}>{client.email}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
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
      height: 80,
    },
    errorText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
    },
    statusContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    statusOption: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    statusOptionSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    statusOptionText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text,
    },
    statusOptionTextSelected: {
      color: theme.colors.surface,
    },
    selectedClient: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    clientInfo: {
      flex: 1,
    },
    clientName: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text,
    },
    clientEmail: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    changeClientButton: {
      padding: theme.spacing.sm,
    },
    selectClientButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
      gap: theme.spacing.sm,
    },
    selectClientText: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.textSecondary,
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
    clientSelector: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.surface,
      zIndex: 1000,
    },
    clientSelectorHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    clientSelectorTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
    },
    closeButton: {
      padding: theme.spacing.sm,
    },
    searchInput: {
      margin: theme.spacing.lg,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
    },
    clientList: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    clientOption: {
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    clientOptionName: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text,
    },
    clientOptionEmail: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: 2,
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
