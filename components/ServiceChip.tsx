// Tend — Small colored service chip
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ServiceType } from '../types';
import { serviceConfig } from '../constants/Colors';

interface ServiceChipProps {
  service: ServiceType;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export default function ServiceChip({
  service,
  size = 'sm',
  showIcon = true,
}: ServiceChipProps) {
  const config = serviceConfig[service];
  const isMd = size === 'md';

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: config.color + '15',
          paddingHorizontal: isMd ? 12 : 8,
          paddingVertical: isMd ? 6 : 4,
        },
      ]}
    >
      {showIcon && (
        <Ionicons
          name={config.icon as any}
          size={isMd ? 14 : 11}
          color={config.color}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.label,
          {
            color: config.color,
            fontSize: isMd ? 13 : 11,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
  },
  icon: {
    marginRight: 4,
  },
  label: {
    fontWeight: '600',
  },
});
