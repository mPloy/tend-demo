// Tend — Not found screen
import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { palette } from '../constants/Colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.emoji}>🍃</Text>
        <Text style={styles.title}>Page not found</Text>
        <Text style={styles.subtitle}>
          This screen does not exist in Tend.
        </Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go back home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: palette.background,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: palette.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: palette.textSecondary,
    marginBottom: 24,
  },
  link: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: palette.primary,
    borderRadius: 12,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.white,
  },
});
