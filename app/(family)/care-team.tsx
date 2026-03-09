// Tend — Family Care Team screen
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette, theme } from '../../constants/Colors';
import { useCareTeam } from '../../hooks/useCareTeam';
import CareTeamCard from '../../components/CareTeamCard';

export default function CareTeamScreen() {
  const insets = useSafeAreaInsets();
  const { members: careTeamMembers, helpers } = useCareTeam();

  const primaryMembers = careTeamMembers.filter((m) => m.role === 'primary');
  const backupMembers = careTeamMembers.filter((m) => m.role === 'backup');

  const findHelper = (helperId: string) =>
    helpers.find((h) => h.id === helperId);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Margaret's Care Team</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Primary Helpers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Primary Helpers</Text>
          {primaryMembers.length === 0 ? (
            <Text style={styles.emptyText}>No primary helpers assigned</Text>
          ) : (
            primaryMembers.map((member) => (
              <CareTeamCard
                key={member.helperId}
                member={member}
                helperData={findHelper(member.helperId)}
              />
            ))
          )}
        </View>

        {/* Backup Helpers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Backup Helpers</Text>
          {backupMembers.length === 0 ? (
            <Text style={styles.emptyText}>No backup helpers assigned</Text>
          ) : (
            backupMembers.map((member) => (
              <CareTeamCard
                key={member.helperId}
                member={member}
                helperData={findHelper(member.helperId)}
              />
            ))
          )}
        </View>

        {/* Continuity Score */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continuity Score</Text>
          <View style={styles.continuityCard}>
            <View style={styles.continuityHeader}>
              <Text style={styles.continuityValue}>92%</Text>
              <Text style={styles.continuityLabel}>Same Helper</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '92%' }]} />
            </View>
            <Text style={styles.continuityDescription}>
              Margaret sees the same helper 92% of the time
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: palette.textPrimary,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.textPrimary,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: palette.textTertiary,
    marginBottom: 12,
  },
  continuityCard: {
    backgroundColor: palette.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    marginBottom: 12,
    ...theme.shadow.sm,
  },
  continuityHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 12,
  },
  continuityValue: {
    fontSize: 32,
    fontWeight: '800',
    color: palette.primary,
  },
  continuityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.textSecondary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: palette.warmGray100,
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: palette.primary,
    borderRadius: 4,
  },
  continuityDescription: {
    fontSize: 14,
    color: palette.textSecondary,
    lineHeight: 20,
  },
});
