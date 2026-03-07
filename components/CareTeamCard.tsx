// Tend — Helper card with primary/backup role badge for family care team
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { CareTeamMember, Helper } from '../types';
import { palette, theme } from '../constants/Colors';
import ServiceChip from './ServiceChip';
import RatingStars from './RatingStars';

interface CareTeamCardProps {
  member: CareTeamMember;
  helperData?: Helper;
}

const roleBadgeConfig: Record<'primary' | 'backup', { bg: string; text: string; label: string }> = {
  primary: {
    bg: palette.primaryLight,
    text: palette.primaryDark,
    label: 'Primary',
  },
  backup: {
    bg: palette.statusPendingLight,
    text: palette.statusPending,
    label: 'Backup',
  },
};

export default function CareTeamCard({ member, helperData }: CareTeamCardProps) {
  const initials = member.helperName
    .split(' ')
    .map((n) => n[0])
    .join('');

  const badge = roleBadgeConfig[member.role];

  const formattedLastVisit = member.lastVisit
    ? new Date(member.lastVisit).toLocaleDateString('en-CA', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <View style={styles.card}>
      {/* Top row: avatar + name + role badge */}
      <View style={styles.topRow}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.nameCol}>
            <Text style={styles.name}>{member.helperName}</Text>
            {formattedLastVisit && (
              <Text style={styles.lastVisit}>Last visit: {formattedLastVisit}</Text>
            )}
          </View>
        </View>
        <View style={[styles.roleBadge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.roleBadgeText, { color: badge.text }]}>
            {badge.label}
          </Text>
        </View>
      </View>

      {/* Services row */}
      <View style={styles.servicesRow}>
        {member.services.map((service) => (
          <ServiceChip key={service} service={service} size="sm" />
        ))}
      </View>

      {/* Rating */}
      <RatingStars rating={member.rating} size={14} showCount={false} />
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.familyPurpleLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.familyPurple,
  },
  nameCol: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.textPrimary,
  },
  lastVisit: {
    fontSize: 12,
    color: palette.textTertiary,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  servicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
});
