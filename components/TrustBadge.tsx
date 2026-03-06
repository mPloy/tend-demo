// Tend — Trust verification badge component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '../constants/Colors';

type BadgeType = 'id_verified' | 'background_checked' | 'references' | 'repeat_client';

interface TrustBadgeProps {
  type: BadgeType;
  count?: number;
  compact?: boolean;
}

const badgeConfig: Record<BadgeType, { label: string; icon: string }> = {
  id_verified: { label: 'ID Verified', icon: 'shield-checkmark' },
  background_checked: { label: 'Background Checked', icon: 'checkmark-circle' },
  references: { label: 'References', icon: 'people' },
  repeat_client: { label: 'Repeat Client', icon: 'heart' },
};

export default function TrustBadge({ type, count, compact = false }: TrustBadgeProps) {
  const config = badgeConfig[type];
  const label =
    type === 'references' && count
      ? `${count} References`
      : type === 'repeat_client' && count
        ? `${count} Repeat Clients`
        : config.label;

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Ionicons name={config.icon as any} size={12} color={palette.verified} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Ionicons name={config.icon as any} size={14} color={palette.verified} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  compactContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: palette.primaryDark,
  },
});
