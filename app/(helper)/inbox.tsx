// Tend — Helper inbox / messages screen
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette, theme } from '../../constants/Colors';
import { useMessages } from '../../hooks/useMessages';
import { useAuth } from '../../contexts/AuthContext';
import type { MessageThread } from '../../types';

export default function HelperInboxScreen() {
  const insets = useSafeAreaInsets();
  const { threads: myThreads } = useMessages();
  const { profile } = useAuth();
  const currentUserId = profile?.id || 'helper-1';

  const getOtherName = (thread: MessageThread) => {
    const idx = thread.participantIds.indexOf(currentUserId);
    return thread.participantNames[idx === 0 ? 1 : 0];
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);
    if (diffHrs < 1) return `${Math.floor(diffMs / (1000 * 60))}m ago`;
    if (diffHrs < 24) return `${Math.floor(diffHrs)}h ago`;
    return d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
  };

  const renderThread = ({ item }: { item: MessageThread }) => {
    const otherName = getOtherName(item);
    const initials = getInitials(otherName);
    const hasUnread = item.unreadCount > 0;

    return (
      <TouchableOpacity style={styles.threadRow} activeOpacity={0.7}>
        {/* Avatar */}
        <View style={[styles.avatar, hasUnread && styles.avatarUnread]}>
          <Text
            style={[
              styles.avatarText,
              hasUnread && styles.avatarTextUnread,
            ]}
          >
            {initials}
          </Text>
        </View>

        {/* Content */}
        <View style={styles.threadContent}>
          <View style={styles.threadTopRow}>
            <Text
              style={[styles.threadName, hasUnread && styles.threadNameBold]}
              numberOfLines={1}
            >
              {otherName}
            </Text>
            <Text style={styles.threadTime}>
              {formatTime(item.lastMessageTime)}
            </Text>
          </View>
          <Text
            style={[
              styles.lastMessage,
              hasUnread && styles.lastMessageUnread,
            ]}
            numberOfLines={2}
          >
            {item.lastMessage}
          </Text>
        </View>

        {/* Unread badge */}
        {hasUnread && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>

      {myThreads.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name={'chatbubbles-outline' as any}
            size={56}
            color={palette.warmGray300}
          />
          <Text style={styles.emptyTitle}>No messages yet</Text>
          <Text style={styles.emptySubtitle}>
            Messages from elders will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={myThreads}
          keyExtractor={(item) => item.id}
          renderItem={renderThread}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
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
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: palette.textPrimary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  threadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarUnread: {
    backgroundColor: palette.primary,
  },
  avatarText: {
    fontSize: 17,
    fontWeight: '700',
    color: palette.primaryDark,
  },
  avatarTextUnread: {
    color: palette.white,
  },
  threadContent: {
    flex: 1,
  },
  threadTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  threadName: {
    fontSize: 15,
    fontWeight: '500',
    color: palette.textPrimary,
    flex: 1,
  },
  threadNameBold: {
    fontWeight: '700',
  },
  threadTime: {
    fontSize: 12,
    color: palette.textTertiary,
    marginLeft: 8,
  },
  lastMessage: {
    fontSize: 14,
    color: palette.textTertiary,
    lineHeight: 19,
  },
  lastMessageUnread: {
    color: palette.textSecondary,
    fontWeight: '500',
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: palette.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.white,
  },
  separator: {
    height: 1,
    backgroundColor: palette.borderLight,
    marginLeft: 66,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
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
  },
});
