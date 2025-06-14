import React from "react";
import { View, Text, Pressable, StatusBar } from "react-native";
import {
  StyleSheet,
  useUnistyles,
  UnistylesRuntime,
} from "react-native-unistyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
  statusBarStyle?: "light-content" | "dark-content" | "auto";
  onBackPress?: () => void;
}

export function Header({
  title,
  subtitle,
  showBackButton = false,
  rightComponent,
  backgroundColor,
  statusBarStyle = "auto",
  onBackPress,
}: HeaderProps) {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const styles = stylesheet(theme);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  // Déterminer le style de la barre de statut automatiquement
  const getStatusBarStyle = () => {
    if (statusBarStyle !== "auto") {
      return statusBarStyle;
    }

    // Utiliser UnistylesRuntime pour détecter le thème actuel
    const currentTheme = UnistylesRuntime.themeName;
    if (currentTheme === "dark") {
      return "light-content"; // Texte clair sur fond sombre
    }

    return "dark-content"; // Texte sombre sur fond clair (défaut)
  };

  return (
    <>
      <StatusBar
        barStyle={getStatusBarStyle()}
        backgroundColor={backgroundColor || theme.colors.surface}
      />
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            backgroundColor: backgroundColor || theme.colors.surface,
          },
        ]}
      >
        <View style={styles.content}>
          <View style={styles.leftSection}>
            {showBackButton && (
              <Pressable style={styles.backButton} onPress={handleBackPress}>
                <MaterialIcons
                  name="arrow-back"
                  size={24}
                  color={theme.colors.text}
                />
              </Pressable>
            )}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          </View>

          {rightComponent && (
            <View style={styles.rightSection}>{rightComponent}</View>
          )}
        </View>
      </View>
    </>
  );
}

const stylesheet = (theme: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      ...theme.shadows.sm,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      minHeight: 56,
    },
    leftSection: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.md,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.sm,
      backgroundColor: theme.colors.surfaceVariant,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
      lineHeight: theme.typography.lineHeight.sm,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: 2,
      lineHeight: theme.typography.lineHeight.sm,
    },
    rightSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
  });
