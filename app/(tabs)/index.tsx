import React from "react";
import { Text, View, Pressable, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useFocusEffect } from "expo-router";
import { useProjects } from "../../hooks/useSupabase";
import { LoadingState } from "../../components/LoadingState";
import { Header } from "../../components/Header";
import { SafeScrollView } from "../../components/SafeScrollView";
import { FloatingActionButton } from "../../components/FloatingActionButton";

export default function ProjectsScreen() {
  const { data: projects, loading, error, refetch } = useProjects();
  const { theme } = useUnistyles();
  const styles = stylesheet(theme);

  // Rafraîchir les données quand l'écran devient actif
  useFocusEffect(
    React.useCallback(() => {
      console.log("Écran projets focalisé - rafraîchissement des données");
      refetch();
    }, [refetch])
  );

  return (
    <>
      <Header
        title="Mes Projets"
        subtitle={`${projects.length} projet${
          projects.length > 1 ? "s" : ""
        } en cours`}
        rightComponent={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/project/create")}
          >
            <MaterialIcons name="add" size={20} color={theme.colors.surface} />
          </TouchableOpacity>
        }
      />
      <SafeScrollView style={styles.container}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialIcons
              name="build"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>En cours</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialIcons
              name="pending"
              size={24}
              color={theme.colors.warning}
            />
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>En attente</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialIcons
              name="check-circle"
              size={24}
              color={theme.colors.success}
            />
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

          <LoadingState
            loading={loading}
            error={error}
            onRetry={refetch}
            isEmpty={projects.length === 0}
            emptyMessage="Aucun projet trouvé"
          >
            {projects.slice(0, 3).map((project) => {
              const getStatusColor = (statut: string) => {
                switch (statut) {
                  case "en_cours":
                    return theme.colors.success;
                  case "brouillon":
                    return theme.colors.warning;
                  case "termine":
                    return theme.colors.info;
                  case "annule":
                    return theme.colors.error;
                  default:
                    return theme.colors.textTertiary;
                }
              };

              const getStatusLabel = (statut: string) => {
                switch (statut) {
                  case "en_cours":
                    return "En cours";
                  case "brouillon":
                    return "Brouillon";
                  case "termine":
                    return "Terminé";
                  case "annule":
                    return "Annulé";
                  default:
                    return statut;
                }
              };

              const totalProductCount = project.produits.reduce(
                (total, produit) => {
                  return total + produit.quantite;
                },
                0
              );

              // Calcul du pourcentage d'avancement (simulé)
              const getProgress = () => {
                if (project.statut === "termine") return 100;
                if (project.statut === "brouillon") return 0;
                if (project.statut === "en_cours") {
                  // Simuler un pourcentage basé sur l'ID du projet
                  return project.id === "proj-1" ? 65 : 20;
                }
                return 0;
              };

              const progress = getProgress();

              return (
                <Pressable
                  key={project.id}
                  style={styles.projectCard}
                  onPress={() => router.push(`/project/${project.id}`)}
                >
                  <View style={styles.projectHeader}>
                    <View style={styles.projectInfo}>
                      <Text style={styles.projectName}>{project.nom}</Text>
                      <Text style={styles.projectClient}>
                        {project.client.entreprise ||
                          `${project.client.prenom} ${project.client.nom}`}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(project.statut) },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {getStatusLabel(project.statut)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.projectDetails}>
                    <View style={styles.projectStat}>
                      <MaterialIcons
                        name="inventory"
                        size={16}
                        color={theme.colors.textSecondary}
                      />
                      <Text style={styles.projectStatText}>
                        {totalProductCount} éléments
                      </Text>
                    </View>
                    <View style={styles.projectStat}>
                      <MaterialIcons
                        name="schedule"
                        size={16}
                        color={theme.colors.textSecondary}
                      />
                      <Text style={styles.projectStatText}>
                        Créé le {project.createdAt.toLocaleDateString("fr-FR")}
                      </Text>
                    </View>
                  </View>

                  {project.statut === "en_cours" && (
                    <View style={styles.progressContainer}>
                      <Text style={styles.progressLabel}>
                        Avancement: {progress}%
                      </Text>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            { width: `${progress}%` },
                          ]}
                        />
                      </View>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </LoadingState>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>

          <View style={styles.actionsGrid}>
            <Pressable
              style={styles.actionCard}
              onPress={() => router.push("/project/create")}
            >
              <MaterialIcons
                name="add-box"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.actionText}>Nouveau projet</Text>
            </Pressable>

            <Pressable style={styles.actionCard}>
              <MaterialIcons
                name="calculate"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.actionText}>Calculateur</Text>
            </Pressable>

            <Pressable style={styles.actionCard}>
              <MaterialIcons
                name="inventory"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.actionText}>Stock</Text>
            </Pressable>

            <Pressable style={styles.actionCard}>
              <MaterialIcons
                name="description"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.actionText}>Devis</Text>
            </Pressable>
          </View>
        </View>
      </SafeScrollView>

      {/* Bouton d'action flottant */}
      <FloatingActionButton
        onPress={() => router.push("/project/create")}
        icon="add"
        label="Nouveau projet"
      />
    </>
  );
}

const stylesheet = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    statsContainer: {
      flexDirection: "row",
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      alignItems: "center",
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
      textAlign: "center",
      marginTop: theme.spacing.xs,
    },
    projectsSection: {
      padding: theme.spacing.md,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
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
      color: "#FFFFFF",
      fontWeight: theme.typography.fontWeight.medium,
    },
    projectDetails: {
      flexDirection: "row",
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    projectStat: {
      flexDirection: "row",
      alignItems: "center",
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
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
    },
    quickActions: {
      padding: theme.spacing.md,
    },
    actionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.md,
    },
    actionCard: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.md,
      alignItems: "center",
      width: "47%",
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.shadows.sm,
    },
    actionText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text,
      marginTop: theme.spacing.sm,
      textAlign: "center",
      fontWeight: theme.typography.fontWeight.medium,
    },
    addButton: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
  });
