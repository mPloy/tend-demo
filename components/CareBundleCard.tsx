// Tend — Care bundle package card with visual impact
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CareBundle } from '../types';
import { palette, theme, serviceConfig } from '../constants/Colors';

interface CareBundleCardProps {
  bundle: CareBundle;
  onPress?: () => void;
}

export default function CareBundleCard({ bundle, onPress }: CareBundleCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Colored accent strip */}
      <View style={[styles.accentStrip, { backgroundColor: bundle.color }]} />

      {/* Popular badge */}
      {bundle.popular && (
        <View style={styles.popularBadge}>
          <Ionicons name={'flame' as any} size={11} color={palette.white} />
          <Text style={styles.popularText}>Popular</Text>
        </View>
      )}

      {/* Header: icon + name + tagline */}
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: bundle.color + '20' }]}>
          <Ionicons
            name={bundle.icon as any}
            size={24}
            color={bundle.color}
          />
        </View>
        <View style={[styles.headerText, bundle.popular && { paddingRight: 72 }]}>
          <Text style={styles.bundleName}>{bundle.name}</Text>
          <Text style={styles.tagline}>{bundle.tagline}</Text>
        </View>
      </View>

      {/* Service list */}
      <View style={styles.serviceList}>
        {bundle.services.map((item) => {
          const config = serviceConfig[item.service];
          return (
            <View key={item.service} style={styles.serviceRow}>
              <View style={styles.serviceLeft}>
                <Ionicons
                  name={config.icon as any}
                  size={16}
                  color={config.color}
                />
                <Text style={styles.serviceLabel}>{config.label}</Text>
              </View>
              <Text style={styles.serviceHours}>{item.hoursPerWeek}h/week</Text>
            </View>
          );
        })}
      </View>

      {/* Price section */}
      <View style={styles.priceSection}>
        <View style={styles.priceRow}>
          <Text style={styles.regularPrice}>
            ${bundle.regularPrice.toFixed(2)}
          </Text>
          <Text style={styles.weeklyPrice}>
            ${bundle.weeklyPrice.toFixed(2)}
            <Text style={styles.perWeek}>/week</Text>
          </Text>
        </View>
        <View style={styles.savingsBadge}>
          <Ionicons name={'arrow-down' as any} size={11} color={palette.primary} />
          <Text style={styles.savingsText}>Save {bundle.savingsPercent}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: 16,
    overflow: 'hidden',
    ...theme.shadow.sm,
  },
  accentStrip: {
    height: 4,
    width: '100%',
  },
  popularBadge: {
    position: 'absolute',
    top: 4 + 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  popularText: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  bundleName: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.textPrimary,
  },
  tagline: {
    fontSize: 13,
    color: palette.textSecondary,
    marginTop: 2,
  },
  serviceList: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceLabel: {
    fontSize: 14,
    color: palette.textPrimary,
  },
  serviceHours: {
    fontSize: 13,
    color: palette.textSecondary,
    fontWeight: '500',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: palette.borderLight,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  regularPrice: {
    fontSize: 14,
    color: palette.textTertiary,
    textDecorationLine: 'line-through',
  },
  weeklyPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.primary,
  },
  perWeek: {
    fontSize: 13,
    fontWeight: '500',
    color: palette.textSecondary,
  },
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.primary,
  },
});
