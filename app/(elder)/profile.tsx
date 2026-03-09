// Tend — Elder profile screen
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { palette, theme, serviceConfig } from '../../constants/Colors';
import { useProfile } from '../../hooks/useProfile';
import { useRecurringSchedules } from '../../hooks/useRecurringSchedules';
import { useAuth } from '../../contexts/AuthContext';
import RatingStars from '../../components/RatingStars';
import RegularHelperCard from '../../components/RegularHelperCard';
import RecurringScheduleCard from '../../components/RecurringScheduleCard';

export default function ElderProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signOut } = useAuth();
  const { elder } = useProfile();
  const { schedules: recurringSchedules, regularHelpers } = useRecurringSchedules();

  if (!elder) return null;

  const initials = `${elder.firstName[0]}${elder.lastName[0]}`;
  const memberDate = new Date(elder.memberSince).toLocaleDateString('en-CA', {
    month: 'long',
    year: 'numeric',
  });

  const menuItems: {
    icon: string;
    label: string;
    subtitle?: string;
    badge?: string;
  }[] = [
    {
      icon: 'heart',
      label: 'Favorite Helpers',
      subtitle: `${elder.favoriteHelpers.length} saved`,
    },
    { icon: 'card', label: 'Payment Methods', subtitle: 'Visa ****4829' },
    { icon: 'shield-checkmark', label: 'ID & Verification', subtitle: 'Verified' },
    { icon: 'settings', label: 'Preferences', subtitle: 'Notifications, privacy' },
    { icon: 'help-circle', label: 'Help & Support' },
    { icon: 'document-text', label: 'Terms & Privacy' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>
            {elder.firstName} {elder.lastName}
          </Text>
          <View style={styles.ratingRow}>
            <RatingStars
              rating={elder.rating}
              count={elder.totalReviews}
              size={14}
            />
          </View>
          <Text style={styles.memberSince}>
            Member since {memberDate}
          </Text>
          <Text style={styles.location}>
            {elder.city} {'\u00B7'} {elder.postalCode}
          </Text>
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Address</Text>
          <View style={styles.addressCard}>
            <View style={styles.addressRow}>
              <View style={styles.addressIconCircle}>
                <Ionicons name={'location' as any} size={18} color={palette.primary} />
              </View>
              <View style={styles.addressContent}>
                <Text style={styles.addressStreet}>{elder.streetAddress}</Text>
                <Text style={styles.addressCity}>
                  {elder.city}, {elder.province} {elder.postalCode}
                </Text>
              </View>
              <TouchableOpacity style={styles.editButton} activeOpacity={0.6}>
                <Ionicons name={'create-outline' as any} size={16} color={palette.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.addressNote}>
              <Ionicons name={'information-circle-outline' as any} size={14} color={palette.textTertiary} />
              <Text style={styles.addressNoteText}>
                Your postal code is used to match nearby helpers
              </Text>
            </View>
          </View>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{elder.bio}</Text>
        </View>

        {/* Needs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services Needed</Text>
          <View style={styles.needsRow}>
            {elder.needs.map((need) => {
              const config = serviceConfig[need];
              return (
                <View
                  key={need}
                  style={[
                    styles.needChip,
                    { backgroundColor: config.color + '12' },
                  ]}
                >
                  <Ionicons
                    name={config.icon as any}
                    size={14}
                    color={config.color}
                  />
                  <Text style={[styles.needLabel, { color: config.color }]}>
                    {config.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Your Regular Helpers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Regular Helpers</Text>
          {regularHelpers.map((rh) => (
            <RegularHelperCard key={rh.helperId} regularHelper={rh} />
          ))}
        </View>

        {/* Recurring Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recurring Schedule</Text>
          {recurringSchedules.map((rs) => (
            <RecurringScheduleCard key={rs.id} schedule={rs} />
          ))}
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.menuItem}
              activeOpacity={0.6}
            >
              <View style={styles.menuIconCircle}>
                <Ionicons
                  name={item.icon as any}
                  size={18}
                  color={palette.primary}
                />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.subtitle && (
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                )}
              </View>
              <Ionicons
                name={'chevron-forward' as any}
                size={18}
                color={palette.warmGray400}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign out */}
        <TouchableOpacity
          style={styles.signOutButton}
          activeOpacity={0.7}
          onPress={async () => { await signOut(); router.replace('/'); }}
        >
          <Ionicons
            name={'log-out-outline' as any}
            size={20}
            color={palette.accent}
          />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Tend v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: palette.surface,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...theme.shadow.sm,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: palette.white,
    letterSpacing: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: palette.textPrimary,
    marginBottom: 6,
  },
  ratingRow: {
    marginBottom: 6,
  },
  memberSince: {
    fontSize: 13,
    color: palette.textTertiary,
    marginBottom: 2,
  },
  location: {
    fontSize: 13,
    color: palette.textSecondary,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: palette.textPrimary,
    marginBottom: 10,
  },
  addressCard: {
    backgroundColor: palette.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 14,
    ...theme.shadow.sm,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressContent: {
    flex: 1,
  },
  addressStreet: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.textPrimary,
  },
  addressCity: {
    fontSize: 13,
    color: palette.textSecondary,
    marginTop: 2,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: palette.borderLight,
  },
  addressNoteText: {
    fontSize: 12,
    color: palette.textTertiary,
    flex: 1,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 21,
    color: palette.textSecondary,
  },
  needsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  needChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },
  needLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  menuSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: theme.borderRadius.lg,
    marginBottom: 8,
  },
  menuIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.textPrimary,
  },
  menuSubtitle: {
    fontSize: 12,
    color: palette.textTertiary,
    marginTop: 1,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: palette.accentLight,
    gap: 8,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.accent,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: palette.textTertiary,
    marginTop: 20,
  },
});
