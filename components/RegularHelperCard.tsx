// Tend — Compact helper relationship card
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RegularHelper } from '../types';
import { palette, theme } from '../constants/Colors';
import ServiceChip from './ServiceChip';
import RatingStars from './RatingStars';

interface RegularHelperCardProps {
  regularHelper: RegularHelper;
  compact?: boolean;
}

export default function RegularHelperCard({
  regularHelper,
  compact = false,
}: RegularHelperCardProps) {
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('');

  const formattedNextVisit = regularHelper.nextVisit
    ? new Date(regularHelper.nextVisit).toLocaleDateString('en-CA', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.row}>
        {/* Avatar */}
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {getInitials(regularHelper.helperName)}
          </Text>
          {regularHelper.isRecurring && (
            <View style={styles.recurringBadge}>
              <Ionicons name={'repeat' as any} size={10} color={palette.white} />
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Name */}
          <Text style={styles.name}>{regularHelper.helperName}</Text>

          {/* Service chips */}
          <View style={styles.chipsRow}>
            {regularHelper.services.map((service) => (
              <ServiceChip key={service} service={service} size="sm" />
            ))}
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <Text style={styles.visits}>{regularHelper.totalVisits} visits</Text>
            <RatingStars
              rating={regularHelper.rating}
              size={12}
              showCount={false}
            />
          </View>

          {/* Next visit */}
          {formattedNextVisit && (
            <View style={styles.nextVisitRow}>
              <Ionicons
                name={'calendar-outline' as any}
                size={12}
                color={palette.primary}
              />
              <Text style={styles.nextVisitText}>Next: {formattedNextVisit}</Text>
            </View>
          )}
        </View>
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
    ...theme.shadow.sm,
  },
  cardCompact: {
    padding: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.primaryDark,
  },
  recurringBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: palette.surface,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.textPrimary,
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  visits: {
    fontSize: 13,
    color: palette.textSecondary,
    fontWeight: '500',
  },
  nextVisitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  nextVisitText: {
    fontSize: 13,
    color: palette.primary,
    fontWeight: '600',
  },
});
