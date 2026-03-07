// Tend — Family tab layout
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '../../constants/Colors';

export default function FamilyLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.familyPurple,
        tabBarInactiveTintColor: palette.warmGray400,
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: palette.borderLight,
          height: 88,
          paddingBottom: 28,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Overview',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={'home-outline' as any} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="visit-log"
        options={{
          title: 'Visit Log',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={'document-text-outline' as any} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="care-team"
        options={{
          title: 'Care Team',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={'people-outline' as any} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={'settings-outline' as any} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
