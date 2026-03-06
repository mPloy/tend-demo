// Tend — Helper profile (Rover-style public profile view)
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { palette, theme, serviceConfig } from '../../constants/Colors';
import { currentHelper, reviews } from '../../constants/MockData';
import RatingStars from '../../components/RatingStars';
import TrustBadge from '../../components/TrustBadge';
import ReviewCard from '../../components/ReviewCard';

export default function HelperProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const helper = currentHelper;

  const initials = `${helper.firstName[0]}${helper.lastName[0]}`;
  const memberDate = new Date(helper.memberSince).toLocaleDateString('en-CA', {
    month: 'long',
    year: 'numeric',
  });

  // Reviews for this helper
  const helperReviews = reviews.filter((r) => r.toUserId === helper.id);

  // Stats
  const stats = [
    { label: 'Rating', value: helper.rating.toFixed(1), icon: 'star' },
    { label: 'Bookings', value: `${helper.completedBookings}`, icon: 'checkmark-done' },
    { label: 'Repeat', value: `${helper.repeatClients}`, icon: 'heart' },
    { label: 'Response', value: helper.responseTime, icon: 'timer-outline' },
  ];

  const menuItems = [
    { icon: 'calendar', label: 'Availability', subtitle: '5 days/week' },
    { icon: 'wallet', label: 'Earnings & Payouts', subtitle: 'Stripe connected' },
    { icon: 'shield-checkmark', label: 'ID & Verification', subtitle: 'Premium verified' },
    { icon: 'settings', label: 'Settings', subtitle: 'Notifications, privacy' },
    { icon: 'help-circle', label: 'Help & Support' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile header with gradient */}
        <LinearGradient
          colors={['#009966', '#00B47C', '#00D4A1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>
            {helper.firstName} {helper.lastName}
          </Text>
          <Text style={styles.headline}>{helper.headline}</Text>
          <Text style={styles.memberInfo}>
            Member since {memberDate} {'\u00B7'} {helper.city}
          </Text>
        </LinearGradient>

        {/* Verification badges */}
        <View style={styles.badgesSection}>
          {helper.idVerified && <TrustBadge type="id_verified" />}
          {helper.backgroundChecked && (
            <TrustBadge type="background_checked" />
          )}
          {helper.referencesVerified > 0 && (
            <TrustBadge
              type="references"
              count={helper.referencesVerified}
            />
          )}
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {stats.map((stat, idx) => (
            <View key={idx} style={styles.statCard}>
              <Ionicons
                name={stat.icon as any}
                size={18}
                color={palette.primary}
              />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* About me */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bioText}>{helper.bio}</Text>
        </View>

        {/* Services & Rates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services & Rates</Text>
          {helper.services.map((sr) => {
            const config = serviceConfig[sr.service];
            return (
              <View key={sr.service} style={styles.serviceRow}>
                <View style={styles.serviceLeft}>
                  <View
                    style={[
                      styles.serviceIconCircle,
                      { backgroundColor: config.color + '15' },
                    ]}
                  >
                    <Ionicons
                      name={config.icon as any}
                      size={18}
                      color={config.color}
                    />
                  </View>
                  <Text style={styles.serviceLabel}>{config.label}</Text>
                </View>
                <Text style={styles.serviceRate}>
                  ${sr.ratePerHour}/hr
                </Text>
              </View>
            );
          })}
        </View>

        {/* Languages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.chipRow}>
            {helper.languages.map((lang) => (
              <View key={lang} style={styles.langChip}>
                <Ionicons
                  name={'globe-outline' as any}
                  size={14}
                  color={palette.primary}
                />
                <Text style={styles.langChipText}>{lang}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Special Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Skills</Text>
          <View style={styles.chipRow}>
            {helper.specialSkills.map((skill) => (
              <View key={skill} style={styles.skillChip}>
                <Ionicons
                  name={'ribbon-outline' as any}
                  size={14}
                  color={palette.secondary}
                />
                <Text style={styles.skillChipText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <View style={styles.ratingInline}>
              <RatingStars
                rating={helper.rating}
                count={helper.totalReviews}
                size={13}
              />
            </View>
          </View>
          {helperReviews.length === 0 ? (
            <View style={styles.emptyReviews}>
              <Text style={styles.emptyReviewsText}>No reviews yet</Text>
            </View>
          ) : (
            helperReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </View>

        {/* Menu items */}
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
          onPress={() => router.replace('/')}
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

  // Header gradient
  headerGradient: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: palette.white,
    letterSpacing: 1,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: palette.white,
    marginBottom: 4,
  },
  headline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 6,
    fontWeight: '500',
  },
  memberInfo: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },

  // Badges
  badgesSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 12,
    alignItems: 'center',
    ...theme.shadow.sm,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '700',
    color: palette.textPrimary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: palette.textTertiary,
    marginTop: 2,
  },

  // Sections
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.textPrimary,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingInline: {
    marginBottom: 12,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 22,
    color: palette.textSecondary,
  },

  // Services
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: palette.borderLight,
  },
  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: palette.textPrimary,
  },
  serviceRate: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.primary,
  },

  // Chips
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  langChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 5,
  },
  langChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.primaryDark,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.warmGray100,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 5,
  },
  skillChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.secondary,
  },

  // Reviews empty
  emptyReviews: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyReviewsText: {
    fontSize: 14,
    color: palette.textTertiary,
  },

  // Menu
  menuSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
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

  // Sign out
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
