// Tend — Sign up screen with role selection
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette, theme } from '../constants/Colors';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import Button from '../components/Button';
import type { UserRole } from '../types';

const roles: { role: UserRole; icon: string; label: string; color: string; description: string }[] = [
  {
    role: 'elder',
    icon: 'heart',
    label: 'I Need Care',
    color: palette.primary,
    description: 'Find trusted companions and helpers nearby',
  },
  {
    role: 'helper',
    icon: 'hand-left',
    label: 'I Want to Help',
    color: '#6C5CE7',
    description: 'Offer your services to seniors in your community',
  },
  {
    role: 'family',
    icon: 'people',
    label: "I'm a Family Member",
    color: '#4F46E5',
    description: 'Monitor and coordinate care for your loved one',
  },
];

export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signUp } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async () => {
    if (!selectedRole) {
      Alert.alert('Select a role', 'Please choose how you will use Tend.');
      return;
    }
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    if (!isSupabaseConfigured) {
      Alert.alert(
        'Not Connected',
        'Supabase is not configured yet. Add your Supabase credentials to .env to enable account creation.'
      );
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUp(email, password, {
      role: selectedRole,
      firstName,
      lastName,
    });
    setIsSubmitting(false);

    if (error) {
      Alert.alert('Sign Up Failed', error);
    } else {
      Alert.alert(
        'Account Created',
        'Check your email for a confirmation link, then sign in.',
        [{ text: 'OK', onPress: () => router.replace('/login' as any) }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: Math.max(insets.top + 12, 60) }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Ionicons name={'close' as any} size={26} color={palette.textSecondary} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name={'person-add' as any} size={28} color={palette.primary} />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join the Tend community
          </Text>
        </View>

        {/* Role selection */}
        <Text style={styles.sectionLabel}>How will you use Tend?</Text>
        <View style={styles.roleGrid}>
          {roles.map((r) => (
            <TouchableOpacity
              key={r.role}
              style={[
                styles.roleCard,
                selectedRole === r.role && { borderColor: r.color, borderWidth: 2 },
              ]}
              onPress={() => setSelectedRole(r.role)}
              activeOpacity={0.7}
            >
              <View style={[styles.roleIconCircle, { backgroundColor: r.color + '15' }]}>
                <Ionicons name={r.icon as any} size={24} color={r.color} />
              </View>
              <Text style={styles.roleLabel}>{r.label}</Text>
              <Text style={styles.roleDesc}>{r.description}</Text>
              {selectedRole === r.role && (
                <View style={[styles.checkBadge, { backgroundColor: r.color }]}>
                  <Ionicons name={'checkmark' as any} size={14} color={palette.white} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Name fields */}
        <View style={styles.nameRow}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>First Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First"
                placeholderTextColor={palette.textTertiary}
                autoCapitalize="words"
              />
            </View>
          </View>
          <View style={{ width: 12 }} />
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Last Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last"
                placeholderTextColor={palette.textTertiary}
                autoCapitalize="words"
              />
            </View>
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name={'mail-outline' as any}
              size={18}
              color={palette.textTertiary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor={palette.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name={'lock-closed-outline' as any}
              size={18}
              color={palette.textTertiary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="At least 6 characters"
              placeholderTextColor={palette.textTertiary}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? ('eye-off-outline' as any) : ('eye-outline' as any)}
                size={18}
                color={palette.textTertiary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit */}
        <View style={styles.submitSection}>
          {isSubmitting ? (
            <View style={styles.loadingButton}>
              <ActivityIndicator color={palette.white} />
            </View>
          ) : (
            <Button title="Create Account" onPress={handleSignUp} fullWidth size="lg" />
          )}
        </View>

        {/* Sign in link */}
        <View style={styles.signInRow}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/login' as any)}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.warmGray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: palette.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: palette.textSecondary,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.textSecondary,
    marginBottom: 12,
  },
  roleGrid: {
    gap: 10,
    marginBottom: 24,
  },
  roleCard: {
    backgroundColor: palette.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    position: 'relative',
  },
  roleIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.textPrimary,
    marginBottom: 4,
  },
  roleDesc: {
    fontSize: 13,
    color: palette.textSecondary,
    lineHeight: 18,
  },
  checkBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.textSecondary,
    marginBottom: 6,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: palette.textPrimary,
  },
  submitSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  loadingButton: {
    height: 52,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signInText: {
    fontSize: 15,
    color: palette.textSecondary,
  },
  signInLink: {
    fontSize: 15,
    color: palette.primary,
    fontWeight: '700',
  },
});
