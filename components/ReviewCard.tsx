// Tend — Review card component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Review } from '../types';
import { palette, theme } from '../constants/Colors';
import RatingStars from './RatingStars';
import ServiceChip from './ServiceChip';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const initials = review.fromUserName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const formattedDate = new Date(review.date).toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{review.fromUserName}</Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
        </View>
        <ServiceChip service={review.service} />
      </View>
      <View style={styles.ratingRow}>
        <RatingStars rating={review.rating} showCount={false} size={13} />
      </View>
      <Text style={styles.comment}>{review.comment}</Text>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.primaryDark,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.textPrimary,
  },
  date: {
    fontSize: 12,
    color: palette.textTertiary,
    marginTop: 1,
  },
  ratingRow: {
    marginTop: 8,
    marginBottom: 8,
  },
  comment: {
    fontSize: 14,
    lineHeight: 20,
    color: palette.textSecondary,
  },
});
