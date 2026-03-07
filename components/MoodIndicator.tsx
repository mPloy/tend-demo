// Tend — Simple mood display with colored dot + label
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { VisitMood } from '../types';
import { palette } from '../constants/Colors';

interface MoodIndicatorProps {
  mood: VisitMood;
  size?: 'sm' | 'md';
}

const moodConfig: Record<VisitMood, { color: string; emoji: string; label: string }> = {
  great: { color: palette.moodGreat, emoji: '\u{1F60A}', label: 'Great' },
  good: { color: palette.moodGood, emoji: '\u{1F642}', label: 'Good' },
  okay: { color: palette.moodOkay, emoji: '\u{1F610}', label: 'Okay' },
  low: { color: palette.moodLow, emoji: '\u{1F61F}', label: 'Low' },
};

export default function MoodIndicator({ mood, size = 'md' }: MoodIndicatorProps) {
  const config = moodConfig[mood];
  const isSm = size === 'sm';

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.dot,
          {
            width: isSm ? 8 : 12,
            height: isSm ? 8 : 12,
            borderRadius: isSm ? 4 : 6,
            backgroundColor: config.color,
          },
        ]}
      />
      <Text style={[styles.label, { fontSize: isSm ? 11 : 13 }]}>
        {config.emoji} {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    marginRight: 6,
  },
  label: {
    fontWeight: '600',
    color: palette.textPrimary,
  },
});
