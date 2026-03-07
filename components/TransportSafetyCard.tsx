// Tend — Transportation safety indicators card
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette, theme } from '../constants/Colors';
import type { TransportSafety } from '../types';

interface TransportSafetyCardProps {
  transportSafety: TransportSafety;
}

export default function TransportSafetyCard({ transportSafety }: TransportSafetyCardProps) {
  const formattedInsuranceExpiry = transportSafety.insuranceExpiryDate
    ? new Date(transportSafety.insuranceExpiryDate).toLocaleDateString('en-CA', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const vehicleInfo =
    transportSafety.vehicleYear && transportSafety.vehicleMake
      ? `${transportSafety.vehicleYear} ${transportSafety.vehicleMake}`
      : null;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name={'car' as any} size={20} color={palette.primary} />
        <Text style={styles.headerText}>Transportation Safety</Text>
      </View>

      {/* Badge rows */}
      <View style={styles.badgeList}>
        {/* Driver Verified */}
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: transportSafety.driverVerified
                  ? palette.primaryLight
                  : palette.warmGray100,
              },
            ]}
          >
            <Ionicons
              name={'shield-checkmark' as any}
              size={16}
              color={transportSafety.driverVerified ? palette.primary : palette.textTertiary}
            />
          </View>
          <Text style={styles.badgeLabel}>Driver Verified</Text>
          {transportSafety.driverVerified ? (
            <Ionicons name={'checkmark' as any} size={16} color={palette.primary} />
          ) : (
            <Text style={styles.badgeStatus}>Pending</Text>
          )}
        </View>

        {/* Insurance */}
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: palette.statusConfirmedLight }]}>
            <Ionicons name={'document-text' as any} size={16} color={palette.statusConfirmed} />
          </View>
          <Text style={styles.badgeLabel}>
            {transportSafety.insuranceAttested
              ? `Insurance Valid${formattedInsuranceExpiry ? ` until ${formattedInsuranceExpiry}` : ''}`
              : 'Insurance Not Verified'}
          </Text>
        </View>

        {/* Wait & Accompany */}
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: transportSafety.waitAndAccompanyAvailable
                  ? palette.primaryLight
                  : palette.warmGray100,
              },
            ]}
          >
            <Ionicons
              name={'heart' as any}
              size={16}
              color={transportSafety.waitAndAccompanyAvailable ? palette.primary : palette.textTertiary}
            />
          </View>
          <Text style={styles.badgeLabel}>Wait & Accompany Available</Text>
          {transportSafety.waitAndAccompanyAvailable ? (
            <Ionicons name={'checkmark' as any} size={16} color={palette.primary} />
          ) : (
            <Text style={styles.badgeStatus}>No</Text>
          )}
        </View>
      </View>

      {/* Vehicle info */}
      {vehicleInfo && (
        <View style={styles.vehicleRow}>
          <Ionicons name={'car-sport-outline' as any} size={16} color={palette.textSecondary} />
          <Text style={styles.vehicleText}>{vehicleInfo}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    marginBottom: 12,
    ...theme.shadow.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  headerText: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: palette.textPrimary,
  },
  badgeList: {
    gap: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLabel: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
    color: palette.textPrimary,
  },
  badgeStatus: {
    fontSize: theme.fontSize.xs,
    color: palette.textTertiary,
    fontWeight: '600',
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: palette.borderLight,
  },
  vehicleText: {
    fontSize: theme.fontSize.sm,
    color: palette.textSecondary,
    fontWeight: '500',
  },
});
