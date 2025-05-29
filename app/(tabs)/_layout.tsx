import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'] | React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
  type?: 'FontAwesome' | 'MaterialIcons';
}) {
  const IconComponent = props.type === 'MaterialIcons' ? MaterialIcons : FontAwesome;
  return <IconComponent size={28} style={{ marginBottom: -3 }} {...props} name={props.name as any} />;
}

export default function TabLayout() {
  const { theme } = useUnistyles();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: theme.typography.fontWeight.semibold,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Projets',
          tabBarIcon: ({ color }) => <TabBarIcon name="folder" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <MaterialIcons
                    name="add"
                    size={28}
                    color={theme.colors.primary}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Produits',
          tabBarIcon: ({ color }) => <TabBarIcon name="window-maximize" color={color} />,
        }}
      />
      <Tabs.Screen
        name="customers"
        options={{
          title: 'Clients',
          tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Réglages',
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
