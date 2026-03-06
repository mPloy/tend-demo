// Tend — The main "Rover card" — premium helper profile card
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Helper } from '../types';
import { palette, theme, serviceConfig } from '../constants/Colors';
import RatingStars from './RatingStars';
import TrustBadge from './TrustBadge';

interface HelperProfileCardProps {
  helper: Helper;
  onPress?: () => void;
}

// Deterministic avatar color from name
const avatarColors = [
  '#00B47C', '#E84393', '#6C5CE7', '#0984E3',
  '#00CEC9', '#E17055', '#FDCB6E', '#636E72',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export default function HelperProfileCard({
  helper,
  onPress,
}: HelperProfileCardProps) {
  const initials = `${helper.firstName[0]}${helper.lastName[0]}`;
  const avatarBg = getAvatarColor(helper.firstName + helper.lastName);

  // Price range from services
  const rates = helper.services.map((s) => s.ratePerHour);
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);
  const priceLabel =
    minRate === maxRate ? `$${minRate}/hr` : `$${minRate}–$${maxRate}/hr`;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header row: avatar + core info */}
      <View style={styles.headerRow}>
        <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {helper.firstName} {helper.lastName}
            </Text>
            {helper.idVerified && (
              <Ionicons
                name={'shield-checkmark' as any}
                size={16}
                color={palette.verified}
                style={styles.verifiedIcon}
              />
            )}
          </View>
          <Text style={styles.headline} numberOfLines={1}>
            {helper.headline}
          </Text>
          <View style={styles.ratingRow}>
            <RatingStars
              rating={helper.rating}
              count={helper.totalReviews}
              size={13}
            />
          </View>
        </View>
      </View>

      {/* Verification badges */}
      <View style={styles.badgesRow}>
        {helper.idVerified && <TrustBadge type="id_verified" />}
        {helper.backgroundChecked && <TrustBadge type="background_checked" />}
        {helper.referencesVerified > 0 && (
          <TrustBadge type="references" count={helper.referencesVerified} />
        )}
      </View>

      {/* Services chips */}
      <View style={styles.servicesRow}>
        {helper.services.slice(0, 4).map((sr) => {
          const config = serviceConfig[sr.service];
          return (
            <View
              key={sr.service}
              style={[styles.serviceChip, { backgroundColor: config.color + '12' }]}
            >
              <Ionicons
                name={config.icon as any}
                size={11}
                color={config.color}
              />
              <Text style={[styles.serviceChipText, { color: config.color }]}>
                {config.label}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Footer: price, distance, repeat */}
      <View style={styles.footer}>
        <Text style={styles.price}>{priceLabel}</Text>
        <View style={styles.footerRight}>
          {helper.repeatClients > 0 && (
            <View style={styles.repeatBadge}>
              <Ionicons name={'heart' as any} size={11} color={palette.accent} />
              <Text style={styles.repeatText}>
                {helper.repeatClients} repeat
              </Text>
            </View>
          )}
          {helper.distance !== undefined && (
            <View style={styles.distanceBadge}>
              <Ionicons
                name={'location-outline' as any}
                size={12}
                color={palette.textTertiary}
              />
              <Text style={styles.distanceText}>
                {helper.distance.toFixed(1)} km
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: theme.borderRadius.xl,
    padding: 16,
    marginBottom: 14,
    ...theme.shadow.md,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: palette.white,
    letterSpacing: 1,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: palette.textPrimary,
    flex: 1,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  headline: {
    fontSize: 13,
    color: palette.textSecondary,
    marginTop: 2,
  },
  ratingRow: {
    marginTop: 4,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  servicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  serviceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    gap: 4,
  },
  serviceChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: palette.borderLight,
  },
  price: {
    fontSize: 17,
    fontWeight: '700',
    color: palette.primary,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  repeatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  repeatText: {
    fontSize: 12,
    color: palette.accent,
    fontWeight: '600',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  distanceText: {
    fontSize: 12,
    color: palette.textTertiary,
  },
});
