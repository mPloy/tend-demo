// Tend — Rover-inspired green color palette & service config
import type { ServiceType } from '../types';

export const palette = {
  // Primary — Rover-style green
  primary: '#00B47C',
  primaryDark: '#009966',
  primaryLight: '#E6F9F1',
  primaryFaded: '#B2E8D5',

  // Secondary
  secondary: '#2D3436',
  secondaryLight: '#636E72',

  // Accent — coral for CTAs / urgency
  accent: '#FF6B6B',
  accentLight: '#FFE0E0',

  // Backgrounds
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text
  textPrimary: '#2D3436',
  textSecondary: '#636E72',
  textTertiary: '#B2BEC3',
  textInverse: '#FFFFFF',

  // Warm neutrals
  warmGray50: '#FAFAF9',
  warmGray100: '#F5F5F4',
  warmGray200: '#E7E5E4',
  warmGray300: '#D6D3D1',
  warmGray400: '#A8A29E',
  warmGray500: '#78716C',

  // Status colors
  statusPending: '#F59E0B',
  statusPendingLight: '#FEF3C7',
  statusConfirmed: '#3B82F6',
  statusConfirmedLight: '#DBEAFE',
  statusActive: '#00B47C',
  statusActiveLight: '#E6F9F1',
  statusCompleted: '#6B7280',
  statusCompletedLight: '#F3F4F6',
  statusCancelled: '#EF4444',
  statusCancelledLight: '#FEE2E2',

  // Borders
  border: '#E7E5E4',
  borderLight: '#F5F5F4',

  // Shadows
  shadowColor: '#000000',

  // Misc
  star: '#F59E0B',
  verified: '#00B47C',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const theme = {
  colors: palette,
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
    full: 999,
  },
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    hero: 40,
  },
  shadow: {
    sm: {
      shadowColor: palette.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: palette.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: palette.shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 6,
    },
  },
};

export type ServiceConfig = {
  label: string;
  icon: string;
  color: string;
};

export const serviceConfig: Record<ServiceType, ServiceConfig> = {
  companionship: { label: 'Companionship', icon: 'heart', color: '#E84393' },
  groceries: { label: 'Groceries', icon: 'cart', color: '#00B894' },
  meal_prep: { label: 'Meal Prep', icon: 'restaurant', color: '#FDCB6E' },
  errands: { label: 'Errands', icon: 'car', color: '#6C5CE7' },
  housekeeping: { label: 'Housekeeping', icon: 'home', color: '#00CEC9' },
  transportation: { label: 'Transport', icon: 'bus', color: '#0984E3' },
  garden: { label: 'Gardening', icon: 'leaf', color: '#00B47C' },
  tech_help: { label: 'Tech Help', icon: 'laptop', color: '#636E72' },
  pet_care: { label: 'Pet Care', icon: 'paw', color: '#E17055' },
  overnight: { label: 'Overnight', icon: 'moon', color: '#2D3436' },
};

export default theme;
