// Tend — Human QA layer metrics display card
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette, theme } from '../constants/Colors';
import type { QualityScore } from '../types';

interface QualityScoreCardProps {
  qualityScore: QualityScore;
}

function scoreColor(value: number): string {
  if (value > 90) return palette.primary;
  if (value > 75) return palette.statusPending;
  return palette.statusCancelled;
}

interface ProgressBarProps {
  label: string;
  value: number;
}

function ProgressBar({ label, value }: ProgressBarProps) {
  const color = scoreColor(value);
  return (
    <View style={styles.barRow}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.barValue, { color }]}>{value}%</Text>
    </View>
  );
}

export default function QualityScoreCard({ qualityScore }: QualityScoreCardProps) {
  const overallColor = scoreColor(qualityScore.overall);

  const formattedSpotCheck = qualityScore.lastSpotCheckDate
    ? new Date(qualityScore.lastSpotCheckDate).toLocaleDateString('en-CA', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Not yet';

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name={'shield-checkmark' as any} size={20} color={palette.primary} />
        <Text style={styles.headerText}>Quality Assurance</Text>
      </View>

      {/* Overall score circle */}
      <View style={styles.scoreSection}>
        <View style={[styles.scoreCircle, { borderColor: overallColor }]}>
          <Text style={[styles.scoreNumber, { color: overallColor }]}>
            {qualityScore.overall}
          </Text>
        </View>
        <Text style={styles.scoreLabel}>Overall Score</Text>
      </View>

      {/* Progress bars */}
      <View style={styles.barsSection}>
        <ProgressBar label="Punctuality" value={qualityScore.punctuality} />
        <ProgressBar label="Communication" value={qualityScore.communication} />
        <ProgressBar label="Task Completion" value={qualityScore.taskCompletion} />
        <ProgressBar label="Elder Satisfaction" value={qualityScore.elderSatisfaction} />
      </View>

      {/* Status rows */}
      <View style={styles.statusSection}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>First Visit Callback</Text>
          <Ionicons
            name={(qualityScore.firstVisitCallbackCompleted ? 'checkmark-circle' : 'time') as any}
            size={18}
            color={qualityScore.firstVisitCallbackCompleted ? palette.primary : palette.statusPending}
          />
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Last Spot Check</Text>
          <Text style={styles.statusValue}>{formattedSpotCheck}</Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Escalation Support</Text>
          {qualityScore.escalationContactAvailable ? (
            <View style={styles.availableBadge}>
              <Text style={styles.availableBadgeText}>Available 24/7</Text>
            </View>
          ) : (
            <Text style={styles.statusValue}>Unavailable</Text>
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
  scoreSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
  },
  scoreNumber: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '800',
  },
  scoreLabel: {
    fontSize: theme.fontSize.sm,
    color: palette.textSecondary,
    marginTop: 6,
  },
  barsSection: {
    gap: 10,
    marginBottom: 16,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barLabel: {
    width: 110,
    fontSize: theme.fontSize.sm,
    color: palette.textSecondary,
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.warmGray100,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },
  barValue: {
    width: 36,
    fontSize: theme.fontSize.xs,
    fontWeight: '700',
    textAlign: 'right',
  },
  statusSection: {
    borderTopWidth: 1,
    borderTopColor: palette.borderLight,
    paddingTop: 14,
    gap: 10,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: theme.fontSize.sm,
    color: palette.textSecondary,
  },
  statusValue: {
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
    color: palette.textPrimary,
  },
  availableBadge: {
    backgroundColor: palette.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  availableBadgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: '700',
    color: palette.primaryDark,
  },
});
