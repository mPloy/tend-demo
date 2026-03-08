// Tend — Rover-style search bar with location & filter
import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette, theme } from '../constants/Colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search helpers near you...',
  onFilterPress,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <Ionicons
          name={'location' as any}
          size={20}
          color={palette.primary}
          style={styles.locationIcon}
        />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={palette.textTertiary}
        />
        {onFilterPress && (
          <TouchableOpacity
            onPress={onFilterPress}
            style={styles.filterButton}
            activeOpacity={0.7}
          >
            <Ionicons name={'options' as any} size={20} color={palette.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: 14,
    height: 52,
    ...theme.shadow.md,
  },
  locationIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: palette.textPrimary,
    height: '100%',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: palette.warmGray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
