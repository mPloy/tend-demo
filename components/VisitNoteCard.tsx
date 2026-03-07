// Tend — Visit note card for the family visit log
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { VisitNote } from '../types';
import { palette, theme } from '../constants/Colors';
import ServiceChip from './ServiceChip';
import MoodIndicator from './MoodIndicator';

interface VisitNoteCardProps {
  visitNote: VisitNote;
}

export default function VisitNoteCard({ visitNote }: VisitNoteCardProps) {
  const initials = visitNote.helperName
    .split(' ')
    .map((n) => n[0])
    .join('');

  const formattedDate = new Date(visitNote.date).toLocaleDateString('en-CA', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const photoCount = visitNote.photos?.length ?? 0;

  return (
    <View style={styles.card}>
      {/* Header: avatar, name, date, service chip */}
      <View style={styles.header}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.helperName}>{visitNote.helperName}</Text>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
        </View>
        <ServiceChip service={visitNote.service} size="sm" />
      </View>

      {/* Summary */}
      <Text style={styles.summary}>{visitNote.summary}</Text>

      {/* Mood */}
      <View style={styles.moodRow}>
        <Text style={styles.moodLabel}>Mood:</Text>
        <MoodIndicator mood={visitNote.mood} size="sm" />
      </View>

      {/* Task checklist */}
      {visitNote.tasksCompleted.length > 0 && (
        <View style={styles.taskList}>
          {visitNote.tasksCompleted.map((task) => (
            <View key={task.id} style={styles.taskRow}>
              <Ionicons
                name={task.completed ? ('checkmark-circle' as any) : ('ellipse-outline' as any)}
                size={16}
                color={task.completed ? palette.primary : palette.warmGray300}
              />
              <Text
                style={[
                  styles.taskLabel,
                  task.completed && styles.taskCompleted,
                ]}
              >
                {task.label}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Photo count indicator */}
      {photoCount > 0 && (
        <View style={styles.photoRow}>
          <Ionicons name={'camera-outline' as any} size={14} color={palette.textTertiary} />
          <Text style={styles.photoText}>
            {photoCount} photo{photoCount !== 1 ? 's' : ''} shared
          </Text>
        </View>
      )}
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
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.familyPurpleLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.familyPurple,
  },
  headerInfo: {
    justifyContent: 'center',
  },
  helperName: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.textPrimary,
  },
  dateText: {
    fontSize: 12,
    color: palette.textSecondary,
    marginTop: 1,
  },
  summary: {
    fontSize: 14,
    color: palette.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.textTertiary,
  },
  taskList: {
    marginBottom: 10,
    gap: 6,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskLabel: {
    fontSize: 13,
    color: palette.textPrimary,
  },
  taskCompleted: {
    color: palette.textSecondary,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: palette.borderLight,
  },
  photoText: {
    fontSize: 12,
    color: palette.textTertiary,
    fontWeight: '500',
  },
});
