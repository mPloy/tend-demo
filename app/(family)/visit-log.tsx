// Tend — Family Visit Log screen
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
import { useVisitNotes } from '../../hooks/useVisitNotes';
import VisitNoteCard from '../../components/VisitNoteCard';

type FilterOption = 'week' | 'month' | 'all';

const filterTabs: { key: FilterOption; label: string }[] = [
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'all', label: 'All' },
];

function isWithinDays(dateStr: string, days: number): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
}

export default function VisitLogScreen() {
  const insets = useSafeAreaInsets();
  const { visitNotes } = useVisitNotes();
  const [filter, setFilter] = useState<FilterOption>('all');

  const filteredNotes = visitNotes.filter((note) => {
    if (filter === 'week') return isWithinDays(note.date, 7);
    if (filter === 'month') return isWithinDays(note.date, 30);
    return true;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Visit Log</Text>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {filterTabs.map((tab) => {
          const isActive = filter === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
              onPress={() => setFilter(tab.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterTabText,
                  isActive && styles.filterTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name={'document-text-outline' as any}
              size={48}
              color={palette.warmGray300}
            />
            <Text style={styles.emptyTitle}>No visit notes</Text>
            <Text style={styles.emptySubtitle}>
              Visit notes will appear here after each visit
            </Text>
          </View>
        ) : (
          filteredNotes.map((note) => (
            <VisitNoteCard key={note.id} visitNote={note} />
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
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: palette.textPrimary,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  filterTabActive: {
    backgroundColor: palette.familyPurple,
    borderColor: palette.familyPurple,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.textSecondary,
  },
  filterTabTextActive: {
    color: palette.white,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
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
    textAlign: 'center',
  },
});
