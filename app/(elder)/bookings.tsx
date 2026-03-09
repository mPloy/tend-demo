// Tend — Elder bookings screen with tabs
import React, { useState } from 'react';
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
import { useBookings } from '../../hooks/useBookings';
import BookingCard from '../../components/BookingCard';

type Tab = 'upcoming' | 'active' | 'past';

export default function ElderBookingsScreen() {
  const insets = useSafeAreaInsets();
  const { bookings } = useBookings();
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');

  // Hook already filters bookings for the current user
  const upcoming = bookings.filter(
    (b) => b.status === 'pending' || b.status === 'confirmed'
  );
  const active = bookings.filter((b) => b.status === 'active');
  const past = bookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled'
  );

  const tabConfig: { key: Tab; label: string; data: typeof bookings }[] = [
    { key: 'upcoming', label: 'Upcoming', data: upcoming },
    { key: 'active', label: 'Active', data: active },
    { key: 'past', label: 'Past', data: past },
  ];

  const currentData = tabConfig.find((t) => t.key === activeTab)?.data ?? [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {tabConfig.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
              {tab.data.length > 0 && (
                <View
                  style={[
                    styles.tabBadge,
                    isActive && styles.tabBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBadgeText,
                      isActive && styles.tabBadgeTextActive,
                    ]}
                  >
                    {tab.data.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentData.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name={'calendar-outline' as any}
              size={56}
              color={palette.warmGray300}
            />
            <Text style={styles.emptyTitle}>No {activeTab} bookings</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'upcoming'
                ? 'Browse helpers and book your first session!'
                : activeTab === 'active'
                  ? 'You have no sessions in progress right now.'
                  : 'Your completed bookings will appear here.'}
            </Text>
          </View>
        ) : (
          currentData.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              userRole="elder"
            />
          ))
        )}
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
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: palette.textPrimary,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 6,
  },
  tabActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.textSecondary,
  },
  tabTextActive: {
    color: palette.white,
  },
  tabBadge: {
    backgroundColor: palette.warmGray200,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.textSecondary,
  },
  tabBadgeTextActive: {
    color: palette.white,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: palette.textPrimary,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: palette.textTertiary,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
