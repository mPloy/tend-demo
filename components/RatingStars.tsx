// Tend — Star rating display with count
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '../constants/Colors';

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: number;
  showCount?: boolean;
}

export default function RatingStars({
  rating,
  count,
  size = 14,
  showCount = true,
}: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <View style={styles.container}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Ionicons
          key={`full-${i}`}
          name={'star' as any}
          size={size}
          color={palette.star}
          style={styles.star}
        />
      ))}
      {hasHalf && (
        <Ionicons
          name={'star-half' as any}
          size={size}
          color={palette.star}
          style={styles.star}
        />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Ionicons
          key={`empty-${i}`}
          name={'star-outline' as any}
          size={size}
          color={palette.warmGray300}
          style={styles.star}
        />
      ))}
      {showCount && (
        <Text style={[styles.ratingText, { fontSize: size - 1 }]}>
          {rating.toFixed(1)}
          {count !== undefined && (
            <Text style={styles.countText}> ({count})</Text>
          )}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 1,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: '600',
    color: palette.textPrimary,
  },
  countText: {
    fontWeight: '400',
    color: palette.textSecondary,
  },
});
