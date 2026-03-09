// Tend — Helper dashboard screen
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette, theme } from '../../constants/Colors';
import { useBookings } from '../../hooks/useBookings';
import { useProfile } from '../../hooks/useProfile';
import BookingCard from '../../components/BookingCard';

export default function HelperDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { helper } = useProfile();
  const { bookings } = useBookings();

  if (!helper) return null;

  // Hook already filters bookings for the current helper
  const myBookings = bookings;
  const pendingRequests = myBookings.filter((b) => b.status === 'pending');
  const todayBookings = myBookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'active'
  );
  const completedBookings = myBookings.filter((b) => b.status === 'completed');
  const totalEarnings = completedBookings.reduce((sum, b) => sum + b.totalCost, 0);

  const quickStats = [
    {
      icon: 'timer-outline',
      label: 'Response',
      value: helper.responseTime,
      color: palette.statusConfirmed,
    },
    {
      icon: 'checkmark-done',
      label: 'Completion',
      value: '98%',
      color: palette.primary,
    },
    {
      icon: 'star',
      label: 'Rating',
      value: helper.rating.toFixed(1),
      color: palette.star,
    },
    {
      icon: 'heart',
      label: 'Repeat',
      value: `${helper.repeatClients}`,
      color: palette.accent,
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome header */}
        <View style={styles.welcomeRow}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>{helper.firstName}!</Text>
          </View>
          <View style={styles.avatarSmall}>
            <Text style={styles.avatarSmallText}>
              {helper.firstName[0]}{helper.lastName[0]}
            </Text>
          </View>
        </View>

        {/* Earnings banner */}
        <LinearGradient
          colors={['#009966', '#00B47C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.earningsBanner}
        >
          <View style={styles.earningsTop}>
            <Text style={styles.earningsLabel}>Total Earnings</Text>
            <Ionicons name={'wallet-outline' as any} size={22} color="rgba(255,255,255,0.7)" />
          </View>
          <Text style={styles.earningsAmount}>
            ${totalEarnings.toFixed(2)}
          </Text>
          <View style={styles.earningsBreakdown}>
            <View style={styles.earningsPeriod}>
              <Text style={styles.earningsPeriodLabel}>This Week</Text>
              <Text style={styles.earningsPeriodValue}>$56.00</Text>
            </View>
            <View style={styles.earningsDivider} />
            <View style={styles.earningsPeriod}>
              <Text style={styles.earningsPeriodLabel}>This Month</Text>
              <Text style={styles.earningsPeriodValue}>$93.50</Text>
            </View>
            <View style={styles.earningsDivider} />
            <View style={styles.earningsPeriod}>
              <Text style={styles.earningsPeriodLabel}>Completed</Text>
              <Text style={styles.earningsPeriodValue}>{completedBookings.length}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick stats */}
        <View style={styles.statsRow}>
          {quickStats.map((stat, idx) => (
            <View key={idx} style={styles.statCard}>
              <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Pending requests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            {pendingRequests.length > 0 && (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>
                  {pendingRequests.length}
                </Text>
              </View>
            )}
          </View>
          {pendingRequests.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons
                name={'checkmark-circle' as any}
                size={32}
                color={palette.warmGray300}
              />
              <Text style={styles.emptyText}>
                All caught up! No pending requests.
              </Text>
            </View>
          ) : (
            pendingRequests.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                userRole="helper"
              />
            ))
          )}
        </View>

        {/* Today's schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          {todayBookings.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons
                name={'sunny-outline' as any}
                size={32}
                color={palette.warmGray300}
              />
              <Text style={styles.emptyText}>
                Nothing scheduled for today. Enjoy your day!
              </Text>
            </View>
          ) : (
            todayBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                userRole="helper"
              />
            ))
          )}
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
  greeting: {
    fontSize: 15,
    color: palette.textSecondary,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: palette.textPrimary,
  },
  avatarSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSmallText: {
    fontSize: 17,
    fontWeight: '700',
    color: palette.white,
  },
  earningsBanner: {
    marginHorizontal: 20,
    borderRadius: theme.borderRadius.xl,
    padding: 20,
    marginBottom: 16,
  },
  earningsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  earningsLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  earningsAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: palette.white,
    marginBottom: 16,
  },
  earningsBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningsPeriod: {
    flex: 1,
    alignItems: 'center',
  },
  earningsPeriodLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 2,
  },
  earningsPeriodValue: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.white,
  },
  earningsDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 12,
    alignItems: 'center',
    ...theme.shadow.sm,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.textPrimary,
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    color: palette.textTertiary,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.textPrimary,
    marginBottom: 12,
  },
  pendingBadge: {
    backgroundColor: palette.accent,
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
    marginBottom: 12,
  },
  pendingBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.white,
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
