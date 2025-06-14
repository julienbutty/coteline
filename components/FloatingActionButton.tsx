import React from 'react';
import { Pressable, Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
  label?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function FloatingActionButton({
  onPress,
  icon = 'add',
  label,
  disabled = false,
  size = 'medium',
}: FloatingActionButtonProps) {
  const { theme } = useUnistyles();
  const styles = stylesheet(theme);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: 48,
          height: 48,
          iconSize: 20,
        };
      case 'large':
        return {
          width: 72,
          height: 72,
          iconSize: 28,
        };
      default:
        return {
          width: 56,
          height: 56,
          iconSize: 24,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <Pressable
      style={[
        styles.fab,
        {
          width: sizeStyles.width,
          height: sizeStyles.height,
        },
        disabled && styles.fabDisabled,
        label && styles.fabExtended,
      ]}
      onPress={onPress}
      disabled={disabled}
      android_ripple={{
        color: theme.colors.primaryLight,
        borderless: true,
      }}
    >
      <MaterialIcons
        name={icon}
        size={sizeStyles.iconSize}
        color={disabled ? theme.colors.textTertiary : theme.colors.surface}
      />
      {label && (
        <Text
          style={[
            styles.fabLabel,
            disabled && styles.fabLabelDisabled,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const stylesheet = (theme: any) =>
  StyleSheet.create({
    fab: {
      position: 'absolute',
      bottom: 24,
      right: 24,
      backgroundColor: theme.colors.primary,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      ...theme.shadows.lg,
      elevation: 8,
    },
    fabDisabled: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    fabExtended: {
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      minWidth: 120,
    },
    fabLabel: {
      color: theme.colors.surface,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      marginLeft: theme.spacing.sm,
    },
    fabLabelDisabled: {
      color: theme.colors.textTertiary,
    },
  });
