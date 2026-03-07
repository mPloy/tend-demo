// Tend — Severity-coded alert card for family dashboard
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { FamilyAlert, AlertSeverity, AlertType } from '../types';
import { palette, theme } from '../constants/Colors';

interface AlertCardProps {
  alert: FamilyAlert;
}

const severityColors: Record<AlertSeverity, string> = {
  info: palette.alertInfo,
  warning: palette.alertWarning,
  urgent: palette.alertUrgent,
};

const typeIcons: Record<AlertType, string> = {
  missed_visit: 'alert-circle',
  schedule_change: 'calendar',
  helper_change: 'swap-horizontal',
  wellness_note: 'heart',
  photo_shared: 'camera',
};

export default function AlertCard({ alert }: AlertCardProps) {
  const accentColor = severityColors[alert.severity];
  const iconName = typeIcons[alert.type];

  const formattedTime = new Date(alert.timestamp).toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <View style={[styles.card, { borderLeftColor: accentColor }]}>
      {/* Unread dot */}
      {!alert.read && <View style={[styles.unreadDot, { backgroundColor: accentColor }]} />}

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.titleRow}>
            <Ionicons name={iconName as any} size={18} color={accentColor} />
            <Text style={styles.title}>{alert.title}</Text>
          </View>
          <Text style={styles.timestamp}>{formattedTime}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {alert.description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: theme.borderRadius.lg,
    borderLeftWidth: 4,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...theme.shadow.sm,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
    marginTop: 6,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.textPrimary,
    flex: 1,
  },
  timestamp: {
    fontSize: 11,
    color: palette.textTertiary,
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    color: palette.textSecondary,
    lineHeight: 18,
  },
});
