// Tend — Transportation trip record card
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { TripLog } from '../types';
import { palette, theme, serviceConfig } from '../constants/Colors';

interface TripLogCardProps {
  tripLog: TripLog;
}

const statusConfig: Record<
  TripLog['status'],
  { label: string; bg: string; text: string }
> = {
  in_progress: {
    label: 'In Progress',
    bg: palette.statusActiveLight,
    text: palette.statusActive,
  },
  completed: {
    label: 'Completed',
    bg: palette.statusCompletedLight,
    text: palette.statusCompleted,
  },
};

export default function TripLogCard({ tripLog }: TripLogCardProps) {
  const status = statusConfig[tripLog.status];
  const transportColor = serviceConfig.transportation.color;

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <View style={[styles.card, { borderLeftColor: transportColor }]}>
      <View style={styles.body}>
        {/* Timeline layout */}
        <View style={styles.timeline}>
          {/* Pickup */}
          <View style={styles.timelineRow}>
            <View style={styles.dotColumn}>
              <View style={[styles.dot, styles.pickupDot]} />
              <View style={styles.dashedLine} />
            </View>
            <View style={styles.addressColumn}>
              <Text style={styles.addressLabel}>Pickup</Text>
              <Text style={styles.address} numberOfLines={1}>
                {tripLog.pickup}
              </Text>
              <Text style={styles.timeText}>{tripLog.pickupTime}</Text>
            </View>
          </View>

          {/* Destination */}
          <View style={styles.timelineRow}>
            <View style={styles.dotColumn}>
              <View style={[styles.dot, styles.destinationDot]} />
            </View>
            <View style={styles.addressColumn}>
              <Text style={styles.addressLabel}>Destination</Text>
              <Text style={styles.address} numberOfLines={1}>
                {tripLog.destination}
              </Text>
              <Text style={styles.timeText}>{tripLog.dropoffTime}</Text>
            </View>
          </View>
        </View>

        {/* Right side badges */}
        <View style={styles.badgeColumn}>
          <View style={styles.durationBadge}>
            <Ionicons name={'time-outline' as any} size={12} color={transportColor} />
            <Text style={[styles.durationText, { color: transportColor }]}>
              {formatDuration(tripLog.duration)}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.text }]}>
              {status.label}
            </Text>
          </View>
        </View>
      </View>

      {/* Wait & Accompany badge */}
      {tripLog.waitAndAccompany && (
        <View style={styles.waitBadge}>
          <Ionicons name={'heart' as any} size={12} color={palette.accent} />
          <Text style={styles.waitBadgeText}>Wait & Accompany</Text>
        </View>
      )}

      {/* Footer: helper name */}
      <View style={styles.footer}>
        <Ionicons name={'person-outline' as any} size={13} color={palette.textTertiary} />
        <Text style={styles.helperName}>{tripLog.helperName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    ...theme.shadow.sm,
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeline: {
    flex: 1,
    marginRight: 12,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dotColumn: {
    width: 20,
    alignItems: 'center',
    paddingTop: 2,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  pickupDot: {
    backgroundColor: palette.primary,
  },
  destinationDot: {
    backgroundColor: palette.accent,
  },
  dashedLine: {
    width: 2,
    height: 28,
    backgroundColor: palette.warmGray300,
    marginVertical: 2,
    borderStyle: 'dashed',
  },
  addressColumn: {
    flex: 1,
    paddingBottom: 8,
  },
  addressLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: palette.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  address: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.textPrimary,
  },
  timeText: {
    fontSize: 12,
    color: palette.textSecondary,
    marginTop: 2,
  },
  badgeColumn: {
    alignItems: 'flex-end',
    gap: 8,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: serviceConfig.transportation.color + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  waitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: palette.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
    marginTop: 10,
  },
  waitBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.accent,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: palette.borderLight,
    marginTop: 10,
  },
  helperName: {
    fontSize: 13,
    color: palette.textSecondary,
    fontWeight: '500',
  },
});
