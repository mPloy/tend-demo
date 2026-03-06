// Tend — Booking card with status-aware styling
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Booking, BookingStatus } from '../types';
import { palette, theme } from '../constants/Colors';
import ServiceChip from './ServiceChip';

interface BookingCardProps {
  booking: Booking;
  userRole: 'elder' | 'helper';
}

const statusConfig: Record<
  BookingStatus,
  { label: string; bg: string; text: string; icon: string }
> = {
  pending: {
    label: 'Pending',
    bg: palette.statusPendingLight,
    text: palette.statusPending,
    icon: 'time',
  },
  confirmed: {
    label: 'Confirmed',
    bg: palette.statusConfirmedLight,
    text: palette.statusConfirmed,
    icon: 'checkmark-circle',
  },
  active: {
    label: 'In Progress',
    bg: palette.statusActiveLight,
    text: palette.statusActive,
    icon: 'pulse',
  },
  completed: {
    label: 'Completed',
    bg: palette.statusCompletedLight,
    text: palette.statusCompleted,
    icon: 'checkmark-done',
  },
  cancelled: {
    label: 'Cancelled',
    bg: palette.statusCancelledLight,
    text: palette.statusCancelled,
    icon: 'close-circle',
  },
};

export default function BookingCard({ booking, userRole }: BookingCardProps) {
  const status = statusConfig[booking.status];
  const displayName =
    userRole === 'elder' ? booking.helperName : booking.elderName;

  const formattedDate = new Date(booking.date).toLocaleDateString('en-CA', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={[styles.card, booking.status === 'active' && styles.activeCard]}>
      {/* Top row: service chip + status badge */}
      <View style={styles.topRow}>
        <ServiceChip service={booking.service} size="md" />
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Ionicons name={status.icon as any} size={12} color={status.text} />
          <Text style={[styles.statusText, { color: status.text }]}>
            {status.label}
          </Text>
        </View>
      </View>

      {/* Name & details */}
      <View style={styles.detailsRow}>
        <View style={styles.nameAvatar}>
          <View style={styles.miniAvatar}>
            <Text style={styles.miniAvatarText}>
              {displayName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </Text>
          </View>
          <View>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.dateTime}>
              {formattedDate} {'\u00B7'} {booking.startTime} - {booking.endTime}
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom row: duration & cost */}
      <View style={styles.bottomRow}>
        <View style={styles.infoItem}>
          <Ionicons name={'time-outline' as any} size={14} color={palette.textTertiary} />
          <Text style={styles.infoText}>{booking.duration}h</Text>
        </View>
        <Text style={styles.cost}>${booking.totalCost.toFixed(2)}</Text>
      </View>

      {booking.notes && (
        <Text style={styles.notes} numberOfLines={2}>
          {booking.notes}
        </Text>
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
  activeCard: {
    borderLeftWidth: 3,
    borderLeftColor: palette.primary,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  detailsRow: {
    marginBottom: 12,
  },
  nameAvatar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  miniAvatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.primaryDark,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.textPrimary,
  },
  dateTime: {
    fontSize: 13,
    color: palette.textSecondary,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: palette.borderLight,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 13,
    color: palette.textSecondary,
  },
  cost: {
    fontSize: 17,
    fontWeight: '700',
    color: palette.textPrimary,
  },
  notes: {
    fontSize: 13,
    color: palette.textTertiary,
    marginTop: 8,
    fontStyle: 'italic',
  },
});
