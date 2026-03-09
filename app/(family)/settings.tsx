// Tend — Family Settings screen
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { palette, theme } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';

interface ToggleRowProps {
  label: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  description?: string;
}

function ToggleRow({ label, value, onValueChange, description }: ToggleRowProps) {
  return (
    <View style={settingStyles.toggleRow}>
      <View style={settingStyles.toggleInfo}>
        <Text style={settingStyles.toggleLabel}>{label}</Text>
        {description && (
          <Text style={settingStyles.toggleDescription}>{description}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: palette.warmGray200,
          true: palette.familyPurple + '80',
        }}
        thumbColor={value ? palette.familyPurple : palette.warmGray400}
      />
    </View>
  );
}

const settingStyles = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: palette.borderLight,
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: palette.textPrimary,
  },
  toggleDescription: {
    fontSize: 12,
    color: palette.textTertiary,
    marginTop: 2,
    lineHeight: 16,
  },
});

export default function FamilySettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signOut } = useAuth();

  // Notification toggles
  const [missedVisitAlerts, setMissedVisitAlerts] = useState(true);
  const [visitSummaries, setVisitSummaries] = useState(true);
  const [photoSharing, setPhotoSharing] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Privacy
  const [photoConsent, setPhotoConsent] = useState(true);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Notifications section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <ToggleRow
              label="Missed Visit Alerts"
              value={missedVisitAlerts}
              onValueChange={setMissedVisitAlerts}
            />
            <ToggleRow
              label="Visit Summaries"
              value={visitSummaries}
              onValueChange={setVisitSummaries}
            />
            <ToggleRow
              label="Photo Sharing"
              value={photoSharing}
              onValueChange={setPhotoSharing}
            />
            <ToggleRow
              label="Weekly Digest"
              value={weeklyDigest}
              onValueChange={setWeeklyDigest}
            />
          </View>
        </View>

        {/* Privacy section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.card}>
            <ToggleRow
              label="Photo Sharing Consent"
              value={photoConsent}
              onValueChange={setPhotoConsent}
              description="Allow helpers to share photos from visits with your family account"
            />
          </View>
        </View>

        {/* Emergency section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency</Text>
          <View style={styles.card}>
            <View style={styles.emergencyRow}>
              <View style={styles.emergencyIcon}>
                <Ionicons name={'call' as any} size={20} color={palette.accent} />
              </View>
              <View style={styles.emergencyInfo}>
                <Text style={styles.emergencyName}>Dr. Sarah Kim</Text>
                <Text style={styles.emergencyPhone}>604-555-0199</Text>
              </View>
              <Ionicons
                name={'chevron-forward' as any}
                size={18}
                color={palette.textTertiary}
              />
            </View>
          </View>
        </View>

        {/* Account section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
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
        </View>
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
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: palette.textPrimary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: 16,
    ...theme.shadow.sm,
  },
  emergencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  emergencyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyName: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.textPrimary,
  },
  emergencyPhone: {
    fontSize: 13,
    color: palette.textSecondary,
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.accentLight,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 16,
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.accent,
  },
});
