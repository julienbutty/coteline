import React from 'react';
import { StatusBar } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';

interface AppStatusBarProps {
  backgroundColor?: string;
  barStyle?: 'light-content' | 'dark-content' | 'auto';
}

export function AppStatusBar({ 
  backgroundColor, 
  barStyle = 'auto' 
}: AppStatusBarProps) {
  
  // Déterminer le style de la barre de statut automatiquement
  const getStatusBarStyle = () => {
    if (barStyle !== 'auto') {
      return barStyle;
    }

    // Utiliser UnistylesRuntime pour détecter le thème actuel
    const currentTheme = UnistylesRuntime.themeName;
    if (currentTheme === 'dark') {
      return 'light-content'; // Texte clair sur fond sombre
    }

    return 'dark-content'; // Texte sombre sur fond clair (défaut)
  };

  return (
    <StatusBar
      barStyle={getStatusBarStyle()}
      backgroundColor={backgroundColor}
      translucent={true}
    />
  );
}
