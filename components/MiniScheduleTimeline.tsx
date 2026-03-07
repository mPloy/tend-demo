// Tend — Vertical timeline of upcoming visits for family dashboard
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Booking } from '../types';
import { palette, theme } from '../constants/Colors';
import ServiceChip from './ServiceChip';

interface MiniScheduleTimelineProps {
  bookings: Booking[];
}

export default function MiniScheduleTimeline({ bookings }: MiniScheduleTimelineProps) {
  const displayBookings = bookings.slice(0, 5);

  if (displayBookings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No upcoming visits scheduled</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {displayBookings.map((booking, index) => {
        const isLast = index === displayBookings.length - 1;

        const formattedDate = new Date(booking.date).toLocaleDateString('en-CA', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });

        return (
          <View key={booking.id} style={styles.entryRow}>
            {/* Timeline column: dot + line */}
            <View style={styles.timelineCol}>
              <View style={styles.dot} />
              {!isLast && <View style={styles.line} />}
            </View>

            {/* Content column */}
            <View style={styles.contentCol}>
              <Text style={styles.dateText}>{formattedDate}</Text>
              <Text style={styles.timeText}>
                {booking.startTime} - {booking.endTime}
              </Text>
              <View style={styles.detailRow}>
                <Text style={styles.helperName}>{booking.helperName}</Text>
                <ServiceChip service={booking.service} size="sm" />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 4,
  },
  emptyContainer: {
    backgroundColor: palette.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: palette.textTertiary,
  },
  entryRow: {
    flexDirection: 'row',
    minHeight: 72,
  },
  timelineCol: {
    width: 24,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.primary,
    marginTop: 4,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: palette.warmGray200,
    marginTop: 4,
    marginBottom: 4,
  },
  contentCol: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 16,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.textPrimary,
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: palette.textSecondary,
    marginBottom: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  helperName: {
    fontSize: 13,
    fontWeight: '500',
    color: palette.textSecondary,
  },
});
