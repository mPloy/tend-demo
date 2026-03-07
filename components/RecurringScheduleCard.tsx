// Tend — Recurring weekly schedule match display
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RecurringSchedule } from '../types';
import { palette, theme } from '../constants/Colors';
import ServiceChip from './ServiceChip';

interface RecurringScheduleCardProps {
  schedule: RecurringSchedule;
}

export default function RecurringScheduleCard({ schedule }: RecurringScheduleCardProps) {
  const frequencyLabel = schedule.frequency === 'weekly' ? 'Weekly' : 'Biweekly';
  const frequencyColor =
    schedule.frequency === 'weekly' ? palette.primary : palette.statusConfirmed;

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('');

  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Ionicons
            name={'calendar-outline' as any}
            size={18}
            color={palette.primary}
          />
          <Text style={styles.dayText}>Every {schedule.dayOfWeek}</Text>
        </View>
        <View style={[styles.frequencyBadge, { backgroundColor: frequencyColor + '15' }]}>
          <Text style={[styles.frequencyText, { color: frequencyColor }]}>
            {frequencyLabel}
          </Text>
        </View>
      </View>

      {/* Time */}
      <View style={styles.timeRow}>
        <Ionicons name={'time-outline' as any} size={14} color={palette.textTertiary} />
        <Text style={styles.timeText}>
          {schedule.startTime} — {schedule.endTime}
        </Text>
      </View>

      {/* Service chip */}
      <View style={styles.chipRow}>
        <ServiceChip service={schedule.service} size="md" />
      </View>

      {/* Primary helper */}
      <View style={styles.helperRow}>
        <View style={[styles.avatarCircle, { backgroundColor: palette.primaryLight }]}>
          <Text style={[styles.avatarText, { color: palette.primaryDark }]}>
            {getInitials(schedule.primaryHelperName)}
          </Text>
        </View>
        <Text style={styles.helperName}>{schedule.primaryHelperName}</Text>
        <View style={styles.primaryBadge}>
          <Text style={styles.primaryBadgeText}>Primary</Text>
        </View>
      </View>

      {/* Backup helper (if exists) */}
      {schedule.backupHelperName && (
        <View style={styles.helperRow}>
          <View style={[styles.avatarCircle, { backgroundColor: palette.statusPendingLight }]}>
            <Text style={[styles.avatarText, { color: palette.statusPending }]}>
              {getInitials(schedule.backupHelperName)}
            </Text>
          </View>
          <Text style={styles.helperName}>{schedule.backupHelperName}</Text>
          <View style={styles.backupBadge}>
            <Text style={styles.backupBadgeText}>Backup</Text>
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {schedule.totalSessions} sessions completed
        </Text>
        <Text style={styles.footerDot}>{'\u00B7'}</Text>
        <Text style={styles.footerText}>
          Started {new Date(schedule.startedDate).toLocaleDateString('en-CA', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </Text>
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
    borderLeftColor: palette.primary,
    ...theme.shadow.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.textPrimary,
  },
  frequencyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  frequencyText: {
    fontSize: 11,
    fontWeight: '700',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  timeText: {
    fontSize: 14,
    color: palette.textSecondary,
  },
  chipRow: {
    marginBottom: 12,
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
  },
  helperName: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.textPrimary,
    flex: 1,
  },
  primaryBadge: {
    backgroundColor: palette.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  primaryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.primary,
  },
  backupBadge: {
    backgroundColor: palette.statusPendingLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  backupBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.statusPending,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: palette.borderLight,
    marginTop: 4,
  },
  footerText: {
    fontSize: 12,
    color: palette.textTertiary,
  },
  footerDot: {
    fontSize: 12,
    color: palette.textTertiary,
    marginHorizontal: 6,
  },
});
