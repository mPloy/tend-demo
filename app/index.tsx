// Tend — Welcome screen (Rover-style green gradient with role selection)
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { palette } from '../constants/Colors';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#009966', '#00B47C', '#00D4A1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Brand area */}
      <View style={styles.brandArea}>
        <View style={styles.iconCircle}>
          <Ionicons name={'leaf' as any} size={32} color={palette.primary} />
        </View>
        <Text style={styles.brandName}>Tend</Text>
        <Text style={styles.tagline}>
          Caring companionship,{'\n'}a tap away
        </Text>
      </View>

      {/* Role cards */}
      <View style={styles.cardsArea}>
        <Text style={styles.prompt}>How can we help?</Text>

        <TouchableOpacity
          style={styles.roleCard}
          activeOpacity={0.85}
          onPress={() => router.push('/(elder)')}
        >
          <View style={styles.roleIconCircle}>
            <Ionicons name={'heart' as any} size={28} color={palette.primary} />
          </View>
          <View style={styles.roleCardContent}>
            <Text style={styles.roleTitle}>I need help</Text>
            <Text style={styles.roleSubtitle}>
              Find trusted companions for daily support
            </Text>
          </View>
          <Ionicons
            name={'chevron-forward' as any}
            size={22}
            color={palette.warmGray400}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roleCard}
          activeOpacity={0.85}
          onPress={() => router.push('/(helper)')}
        >
          <View
            style={[styles.roleIconCircle, { backgroundColor: '#F0F0FF' }]}
          >
            <Ionicons
              name={'hand-left' as any}
              size={28}
              color="#6C5CE7"
            />
          </View>
          <View style={styles.roleCardContent}>
            <Text style={styles.roleTitle}>I want to help</Text>
            <Text style={styles.roleSubtitle}>
              Earn by making a difference in elders' lives
            </Text>
          </View>
          <Ionicons
            name={'chevron-forward' as any}
            size={22}
            color={palette.warmGray400}
          />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.loginLink}>
            Already have an account?{' '}
            <Text style={styles.loginLinkBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
  },
  brandArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  brandName: {
    fontSize: 36,
    fontWeight: '800',
    color: palette.white,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 22,
    fontWeight: '500',
  },
  cardsArea: {
    flex: 1,
    backgroundColor: palette.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  prompt: {
    fontSize: 22,
    fontWeight: '700',
    color: palette.textPrimary,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  roleIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  roleCardContent: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.textPrimary,
    marginBottom: 3,
  },
  roleSubtitle: {
    fontSize: 13,
    color: palette.textSecondary,
    lineHeight: 18,
  },
  footer: {
    paddingBottom: 48,
    paddingTop: 12,
    backgroundColor: palette.background,
    alignItems: 'center',
  },
  loginLink: {
    fontSize: 15,
    color: palette.textSecondary,
  },
  loginLinkBold: {
    color: palette.primary,
    fontWeight: '700',
  },
});
