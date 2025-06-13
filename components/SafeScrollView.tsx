import React from 'react';
import { ScrollView, View, ScrollViewProps } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  backgroundColor?: string;
  paddingBottom?: boolean;
}

export function SafeScrollView({
  children,
  backgroundColor,
  paddingBottom = true,
  style,
  contentContainerStyle,
  ...props
}: SafeScrollViewProps) {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const styles = stylesheet(theme);

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: backgroundColor || theme.colors.background },
        style,
      ]}
      contentContainerStyle={[
        styles.contentContainer,
        paddingBottom && { paddingBottom: insets.bottom + theme.spacing.md },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {children}
    </ScrollView>
  );
}

const stylesheet = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
    },
  });
