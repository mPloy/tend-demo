// Tend — Explore screen (Rover-style search-first experience)
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette, theme, serviceConfig } from '../../constants/Colors';
import { helpers } from '../../constants/MockData';
import SearchBar from '../../components/SearchBar';
import HelperProfileCard from '../../components/HelperProfileCard';
import type { ServiceType } from '../../types';

const allServices: { key: 'all' | ServiceType; label: string; icon: string }[] = [
  { key: 'all', label: 'All', icon: 'apps' },
  ...Object.entries(serviceConfig).map(([key, val]) => ({
    key: key as ServiceType,
    label: val.label,
    icon: val.icon,
  })),
];

type SortOption = 'rating' | 'distance' | 'price';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<'all' | ServiceType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('rating');

  // Filter helpers
  const filtered = helpers.filter((h) => {
    if (selectedService !== 'all') {
      if (!h.services.some((s) => s.service === selectedService)) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        h.firstName.toLowerCase().includes(q) ||
        h.lastName.toLowerCase().includes(q) ||
        h.headline.toLowerCase().includes(q) ||
        h.specialSkills.some((sk) => sk.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Sort helpers
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'distance') return (a.distance ?? 99) - (b.distance ?? 99);
    if (sortBy === 'price') {
      const aMin = Math.min(...a.services.map((s) => s.ratePerHour));
      const bMin = Math.min(...b.services.map((s) => s.ratePerHour));
      return aMin - bMin;
    }
    return 0;
  });

  const sortOptions: { key: SortOption; label: string; icon: string }[] = [
    { key: 'rating', label: 'Rating', icon: 'star' },
    { key: 'distance', label: 'Distance', icon: 'location' },
    { key: 'price', label: 'Price', icon: 'pricetag' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.locationLabel}>Your location</Text>
          <View style={styles.locationRow}>
            <Ionicons name={'location' as any} size={16} color={palette.primary} />
            <Text style={styles.locationText}>Vancouver, BC</Text>
            <Ionicons name={'chevron-down' as any} size={14} color={palette.textTertiary} />
          </View>
        </View>
        <TouchableOpacity style={styles.notifButton}>
          <Ionicons name={'notifications-outline' as any} size={22} color={palette.textPrimary} />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by name, skill, or service..."
        onFilterPress={() => {}}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Service categories horizontal scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {allServices.map((svc) => {
            const isActive = selectedService === svc.key;
            return (
              <TouchableOpacity
                key={svc.key}
                style={[
                  styles.categoryChip,
                  isActive && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedService(svc.key)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={svc.icon as any}
                  size={16}
                  color={isActive ? palette.white : palette.textSecondary}
                />
                <Text
                  style={[
                    styles.categoryLabel,
                    isActive && styles.categoryLabelActive,
                  ]}
                >
                  {svc.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Section header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Top Rated Helpers Near You
          </Text>
          <Text style={styles.resultCount}>{sorted.length} found</Text>
        </View>

        {/* Sort pills */}
        <View style={styles.sortRow}>
          {sortOptions.map((opt) => {
            const isActive = sortBy === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[styles.sortPill, isActive && styles.sortPillActive]}
                onPress={() => setSortBy(opt.key)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={opt.icon as any}
                  size={13}
                  color={isActive ? palette.primary : palette.textTertiary}
                />
                <Text
                  style={[
                    styles.sortLabel,
                    isActive && styles.sortLabelActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Helper cards */}
        {sorted.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name={'search' as any} size={48} color={palette.warmGray300} />
            <Text style={styles.emptyTitle}>No helpers found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your filters or search query
            </Text>
          </View>
        ) : (
          sorted.map((helper) => (
            <HelperProfileCard
              key={helper.id}
              helper={helper}
              onPress={() => {}}
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  locationLabel: {
    fontSize: 11,
    color: palette.textTertiary,
    fontWeight: '500',
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.textPrimary,
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.sm,
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.accent,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  categoriesRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    backgroundColor: palette.surface,
    gap: 6,
    borderWidth: 1,
    borderColor: palette.border,
  },
  categoryChipActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.textSecondary,
  },
  categoryLabelActive: {
    color: palette.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.textPrimary,
  },
  resultCount: {
    fontSize: 13,
    color: palette.textTertiary,
    fontWeight: '500',
  },
  sortRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 4,
  },
  sortPillActive: {
    borderColor: palette.primary,
    backgroundColor: palette.primaryLight,
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.textTertiary,
  },
  sortLabelActive: {
    color: palette.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: palette.textPrimary,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: palette.textTertiary,
    marginTop: 4,
  },
});
