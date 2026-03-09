// Tend — Family Overview Dashboard
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette, theme } from '../../constants/Colors';
import { useProfile } from '../../hooks/useProfile';
import { useBookings } from '../../hooks/useBookings';
import { useFamilyAlerts } from '../../hooks/useFamilyAlerts';
import { useCareTeam } from '../../hooks/useCareTeam';
import MiniScheduleTimeline from '../../components/MiniScheduleTimeline';
import AlertCard from '../../components/AlertCard';
import CareTeamCard from '../../components/CareTeamCard';

export default function FamilyOverviewScreen() {
  const insets = useSafeAreaInsets();
  const { family } = useProfile();
  const { bookings } = useBookings();
  const { alerts: familyAlerts } = useFamilyAlerts();
  const { members: careTeamMembers, helpers } = useCareTeam();

  if (!family) return null;

  // Upcoming bookings for the linked elder (hook filters for family role)
  const upcomingBookings = bookings
    .filter(
      (b) => b.status === 'confirmed' || b.status === 'pending'
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Primary care team members
  const primaryMembers = careTeamMembers.filter((m) => m.role === 'primary');

  // Find helper data for care team cards
  const findHelper = (helperId: string) =>
    helpers.find((h) => h.id === helperId);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome header */}
        <View style={styles.welcomeRow}>
          <View style={styles.welcomeText}>
            <Text style={styles.greeting}>Hi {family.firstName},</Text>
            <Text style={styles.subtitle}>
              Here's {family.linkedElderName}'s week
            </Text>
          </View>
          <View style={styles.avatarSmall}>
            <Text style={styles.avatarSmallText}>
              {family.firstName[0]}
              {family.lastName[0]}
            </Text>
          </View>
        </View>

        {/* Section 1: Upcoming Visits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Visits</Text>
          <MiniScheduleTimeline bookings={upcomingBookings} />
        </View>

        {/* Section 2: Recent Alerts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Alerts</Text>
          {familyAlerts.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons
                name={'checkmark-circle' as any}
                size={32}
                color={palette.warmGray300}
              />
              <Text style={styles.emptyText}>No new alerts</Text>
            </View>
          ) : (
            familyAlerts.slice(0, 5).map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          )}
        </View>

        {/* Section 3: Care Team */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Care Team</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.viewAll}>View All {'\u2192'}</Text>
            </TouchableOpacity>
          </View>
          {primaryMembers.slice(0, 3).map((member) => (
            <CareTeamCard
              key={member.helperId}
              member={member}
              helperData={findHelper(member.helperId)}
            />
          ))}
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
  scrollContent: {
    paddingBottom: 24,
  },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  welcomeText: {
    flex: 1,
    marginRight: 12,
  },
  greeting: {
    fontSize: 15,
    color: palette.textSecondary,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '800',
    color: palette.textPrimary,
  },
  avatarSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.familyPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSmallText: {
    fontSize: 17,
    fontWeight: '700',
    color: palette.white,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.textPrimary,
    marginBottom: 12,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.familyPurple,
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: palette.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: palette.textTertiary,
    marginTop: 8,
    textAlign: 'center',
  },
});
