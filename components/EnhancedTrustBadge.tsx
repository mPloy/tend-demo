// Tend — Expandable verification audit trail card
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette, theme } from '../constants/Colors';
import type { VerificationRecord, VerificationStatus } from '../types';

interface EnhancedTrustBadgeProps {
  verificationRecords: VerificationRecord[];
}

const statusIcon: Record<VerificationStatus, { name: string; color: string }> = {
  cleared: { name: 'checkmark-circle', color: palette.primary },
  pending: { name: 'time', color: palette.statusPending },
  expired: { name: 'close-circle', color: palette.statusCancelled },
  not_submitted: { name: 'remove-circle-outline', color: palette.textTertiary },
};

export default function EnhancedTrustBadge({ verificationRecords }: EnhancedTrustBadgeProps) {
  const [expanded, setExpanded] = useState(false);

  const passed = verificationRecords.filter((r) => r.status === 'cleared').length;
  const total = verificationRecords.length;

  return (
    <View style={styles.card}>
      {/* Collapsed summary row */}
      <TouchableOpacity
        style={styles.summaryRow}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.summaryLeft}>
          <Ionicons name={'shield-checkmark' as any} size={20} color={palette.primary} />
          <Text style={styles.summaryText}>
            {passed}/{total} checks passed
          </Text>
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleText}>{expanded ? 'Hide' : 'View Details'}</Text>
          <Ionicons
            name={(expanded ? 'chevron-up' : 'chevron-down') as any}
            size={16}
            color={palette.textSecondary}
          />
        </View>
      </TouchableOpacity>

      {/* Expanded detail list */}
      {expanded && (
        <View style={styles.detailList}>
          {verificationRecords.map((record, index) => {
            const icon = statusIcon[record.status];
            const formattedDate = record.verifiedDate
              ? new Date(record.verifiedDate).toLocaleDateString('en-CA', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : null;

            return (
              <View
                key={`${record.type}-${index}`}
                style={[styles.recordRow, index < verificationRecords.length - 1 && styles.recordBorder]}
              >
                <Ionicons name={icon.name as any} size={18} color={icon.color} style={styles.recordIcon} />
                <View style={styles.recordInfo}>
                  <Text style={styles.recordDescription}>{record.description}</Text>
                  {record.issuingAuthority && (
                    <Text style={styles.recordAuthority}>{record.issuingAuthority}</Text>
                  )}
                </View>
                {formattedDate && <Text style={styles.recordDate}>{formattedDate}</Text>}
              </View>
            );
          })}
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryText: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: palette.primary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  toggleText: {
    fontSize: theme.fontSize.sm,
    color: palette.textSecondary,
  },
  detailList: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: palette.borderLight,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  recordBorder: {
    borderBottomWidth: 1,
    borderBottomColor: palette.borderLight,
  },
  recordIcon: {
    marginTop: 1,
    marginRight: 10,
  },
  recordInfo: {
    flex: 1,
  },
  recordDescription: {
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
    color: palette.textPrimary,
    lineHeight: 18,
  },
  recordAuthority: {
    fontSize: theme.fontSize.xs,
    color: palette.textTertiary,
    marginTop: 2,
  },
  recordDate: {
    fontSize: theme.fontSize.xs,
    color: palette.textSecondary,
    marginLeft: 8,
    marginTop: 1,
  },
});
