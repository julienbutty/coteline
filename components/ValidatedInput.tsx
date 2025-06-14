import React, { useState } from 'react';
import { Text, View, TextInput, TextInputProps } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface ValidatedInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  required?: boolean;
  validationType?: 'email' | 'phone' | 'text' | 'number';
  icon?: keyof typeof MaterialIcons.glyphMap;
  helperText?: string;
}

export function ValidatedInput({
  label,
  value,
  onChangeText,
  error,
  required = false,
  validationType = 'text',
  icon,
  helperText,
  ...textInputProps
}: ValidatedInputProps) {
  const { theme } = useUnistyles();
  const styles = stylesheet(theme);
  const [isFocused, setIsFocused] = useState(false);

  // Validation en temps réel
  const getValidationIcon = () => {
    if (!value) return null;
    
    switch (validationType) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? 'check-circle' : 'error';
      case 'phone':
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        return phoneRegex.test(value) ? 'check-circle' : 'error';
      case 'text':
        return value.trim().length > 0 ? 'check-circle' : null;
      case 'number':
        return !isNaN(Number(value)) && value.trim() !== '' ? 'check-circle' : 'error';
      default:
        return null;
    }
  };

  const validationIcon = getValidationIcon();
  const hasError = error || (validationIcon === 'error');
  const isValid = validationIcon === 'check-circle';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      
      <View style={styles.inputContainer}>
        {icon && (
          <MaterialIcons
            name={icon}
            size={20}
            color={isFocused ? theme.colors.primary : theme.colors.textSecondary}
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          style={[
            styles.input,
            icon && styles.inputWithLeftIcon,
            validationIcon && styles.inputWithRightIcon,
            isFocused && styles.inputFocused,
            hasError && styles.inputError,
            isValid && styles.inputValid,
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={theme.colors.textTertiary}
          {...textInputProps}
        />
        
        {validationIcon && (
          <MaterialIcons
            name={validationIcon}
            size={20}
            color={isValid ? theme.colors.success : theme.colors.error}
            style={styles.rightIcon}
          />
        )}
      </View>
      
      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

const stylesheet = (theme: any) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    label: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    required: {
      color: theme.colors.error,
    },
    inputContainer: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
    },
    inputWithLeftIcon: {
      paddingLeft: 48,
    },
    inputWithRightIcon: {
      paddingRight: 48,
    },
    inputFocused: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    inputValid: {
      borderColor: theme.colors.success,
    },
    leftIcon: {
      position: 'absolute',
      left: theme.spacing.md,
      zIndex: 1,
    },
    rightIcon: {
      position: 'absolute',
      right: theme.spacing.md,
      zIndex: 1,
    },
    helperText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    errorText: {
      color: theme.colors.error,
    },
  });
