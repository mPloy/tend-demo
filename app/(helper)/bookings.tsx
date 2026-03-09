// Tend — Helper bookings screen
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

type Tab = 'upcoming' | 'past';

export default function HelperBookingsScreen() {
  const insets = useSafeAreaInsets();
  const { bookings } = useBookings();
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');

  // Hook already filters bookings for the current helper
  const upcoming = bookings.filter(
    (b) =>
      b.status === 'pending' ||
      b.status === 'confirmed' ||
      b.status === 'active'
  );
  const past = bookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled'
  );

  const currentData = activeTab === 'upcoming' ? upcoming : past;

  // Simple calendar header (current week days)
  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + i);
    return {
      dayName: d.toLocaleDateString('en-CA', { weekday: 'short' }),
      dayNum: d.getDate(),
      isToday: d.toDateString() === today.toDateString(),
      hasBooking: bookings.some(
        (b) =>
          new Date(b.date).toDateString() === d.toDateString() &&
          (b.status === 'confirmed' || b.status === 'active')
      ),
    };
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Schedule</Text>
      </View>

      {/* Week calendar strip */}
      <View style={styles.weekStrip}>
        {weekDays.map((day, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.dayCell, day.isToday && styles.dayCellToday]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.dayName,
                day.isToday && styles.dayNameToday,
              ]}
            >
              {day.dayName}
            </Text>
            <Text
              style={[
                styles.dayNum,
                day.isToday && styles.dayNumToday,
              ]}
            >
              {day.dayNum}
            </Text>
            {day.hasBooking && (
              <View
                style={[
                  styles.dayDot,
                  day.isToday && styles.dayDotToday,
                ]}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(['upcoming', 'past'] as Tab[]).map((tab) => {
          const isActive = activeTab === tab;
          const count = tab === 'upcoming' ? upcoming.length : past.length;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.tabText, isActive && styles.tabTextActive]}
              >
                {tab === 'upcoming' ? 'Upcoming' : 'Past'}
              </Text>
              {count > 0 && (
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
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bookings */}
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
            <Text style={styles.emptyTitle}>
              No {activeTab} bookings
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'upcoming'
                ? 'New booking requests will appear here.'
                : 'Your completed sessions will show here.'}
            </Text>
          </View>
        ) : (
          currentData.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              userRole="helper"
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
  weekStrip: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 4,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: palette.surface,
  },
  dayCellToday: {
    backgroundColor: palette.primary,
  },
  dayName: {
    fontSize: 11,
    fontWeight: '500',
    color: palette.textTertiary,
    marginBottom: 4,
  },
  dayNameToday: {
    color: 'rgba(255,255,255,0.8)',
  },
  dayNum: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.textPrimary,
  },
  dayNumToday: {
    color: palette.white,
  },
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: palette.primary,
    marginTop: 4,
  },
  dayDotToday: {
    backgroundColor: palette.white,
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
  },
});
