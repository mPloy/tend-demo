// Tend — Login / sign-in screen
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { palette, theme } from '../constants/Colors';
import Button from '../components/Button';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleDemoElder = () => router.replace('/(elder)');
  const handleDemoHelper = () => router.replace('/(helper)');
  const handleDemoFamily = () => router.replace('/(family)');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
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
            <Ionicons name={'leaf' as any} size={32} color={palette.primary} />
          </View>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Sign in to your Tend account
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
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
                placeholder="Enter your password"
                placeholderTextColor={palette.textTertiary}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? ('eye-off-outline' as any) : ('eye-outline' as any)}
                  size={18}
                  color={palette.textTertiary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <Button title="Sign In" onPress={() => {}} fullWidth size="lg" />
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or try demo mode</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Demo buttons */}
        <View style={styles.demoSection}>
          <TouchableOpacity
            style={styles.demoCard}
            onPress={handleDemoElder}
            activeOpacity={0.7}
          >
            <Ionicons name={'heart' as any} size={22} color={palette.primary} />
            <Text style={styles.demoCardText}>Demo as Elder</Text>
            <Text style={styles.demoCardSub}>Margaret Chen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.demoCard}
            onPress={handleDemoHelper}
            activeOpacity={0.7}
          >
            <Ionicons name={'hand-left' as any} size={22} color="#6C5CE7" />
            <Text style={styles.demoCardText}>Demo as Helper</Text>
            <Text style={styles.demoCardSub}>Sarah Williams</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.demoCard, { marginHorizontal: 0, marginBottom: 24 }]}
          onPress={handleDemoFamily}
          activeOpacity={0.7}
        >
          <Ionicons name={'people' as any} size={22} color="#4F46E5" />
          <Text style={styles.demoCardText}>Demo as Family</Text>
          <Text style={styles.demoCardSub}>Jennifer Chen</Text>
        </TouchableOpacity>

        {/* Sign up */}
        <View style={styles.signUpRow}>
          <Text style={styles.signUpText}>New to Tend? </Text>
          <TouchableOpacity>
            <Text style={styles.signUpLink}>Create Account</Text>
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
    paddingTop: 60,
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
    marginBottom: 32,
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
  form: {
    marginBottom: 24,
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
    fontSize: 15,
    color: palette.textPrimary,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 13,
    color: palette.primary,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: palette.border,
  },
  dividerText: {
    fontSize: 13,
    color: palette.textTertiary,
    marginHorizontal: 12,
  },
  demoSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  demoCard: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  demoCardText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.textPrimary,
    marginTop: 8,
  },
  demoCardSub: {
    fontSize: 12,
    color: palette.textTertiary,
    marginTop: 2,
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    fontSize: 15,
    color: palette.textSecondary,
  },
  signUpLink: {
    fontSize: 15,
    color: palette.primary,
    fontWeight: '700',
  },
});
