// Tend — Rover-style Elder Care Companion Marketplace

export type UserRole = 'elder' | 'helper' | 'family';

export type ServiceType =
  | 'companionship'
  | 'groceries'
  | 'meal_prep'
  | 'errands'
  | 'housekeeping'
  | 'transportation'
  | 'garden'
  | 'tech_help'
  | 'pet_care'
  | 'overnight';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'cancelled';

export type Gender = 'male' | 'female' | 'non_binary';
export type AgeGroup = '20-30' | '30-40' | '40-50' | '50-60' | '60-70';
export type VerificationLevel = 'basic' | 'enhanced' | 'premium';

export interface Elder {
  id: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  province: string;
  postalCode: string;
  avatarUrl?: string;
  rating: number;
  totalReviews: number;
  memberSince: string;
  bio: string;
  needs: ServiceType[];
  preferences: {
    genderPreference: 'male' | 'female' | 'no_preference';
    ageGroupPreference: AgeGroup | 'no_preference';
  };
  favoriteHelpers: string[];
}

export interface ServiceRate {
  service: ServiceType;
  ratePerHour: number;
}

export interface Helper {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  ageGroup: AgeGroup;
  streetAddress: string;
  city: string;
  province: string;
  postalCode: string;
  distance?: number;         // km from searcher
  avatarUrl?: string;
  coverPhotoUrl?: string;
  bio: string;
  headline: string;          // Short tagline like Rover
  services: ServiceRate[];
  specialSkills: string[];
  hasCar: boolean;
  languages: string[];
  verificationLevel: VerificationLevel;
  idVerified: boolean;
  backgroundChecked: boolean;
  referencesVerified: number;
  rating: number;
  totalReviews: number;
  repeatClients: number;
  completedBookings: number;
  responseTime: string;      // e.g., "~1 hour"
  memberSince: string;
  favoriteElders: string[];
  availability: { [day: string]: boolean };
  verificationRecords?: VerificationRecord[];
  qualityScore?: QualityScore;
  transportSafety?: TransportSafety;
}

export interface Booking {
  id: string;
  elderId: string;
  elderName: string;
  helperId: string;
  helperName: string;
  service: ServiceType;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalCost: number;
  status: BookingStatus;
  notes?: string;
  elderRating?: number;
  helperRating?: number;
  createdAt: string;
}

export interface Review {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserRole: UserRole;
  toUserId: string;
  rating: number;
  comment: string;
  service: ServiceType;
  date: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface MessageThread {
  id: string;
  participantIds: string[];
  participantNames: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

// ─── Trust Stack (BC-specific) ─────────────────────────────

export type VerificationCheckType =
  | 'id_passport'
  | 'id_drivers_license'
  | 'criminal_record_check'
  | 'criminal_record_review'   // BC Criminal Records Review Program
  | 'worksafebc_coverage'
  | 'pipa_consent'
  | 'first_aid'
  | 'reference_check';

export type VerificationStatus = 'cleared' | 'pending' | 'expired' | 'not_submitted';

export interface VerificationRecord {
  type: VerificationCheckType;
  status: VerificationStatus;
  verifiedDate?: string;
  expiryDate?: string;
  description: string;
  issuingAuthority?: string;
}

export interface QualityScore {
  overall: number;
  punctuality: number;
  communication: number;
  taskCompletion: number;
  elderSatisfaction: number;
  firstVisitCallbackCompleted: boolean;
  lastSpotCheckDate?: string;
  escalationContactAvailable: boolean;
}

export interface TransportSafety {
  driverVerified: boolean;
  insuranceAttested: boolean;
  insuranceExpiryDate?: string;
  vehicleYear?: number;
  vehicleMake?: string;
  waitAndAccompanyAvailable: boolean;
}

// ─── Family Dashboard ──────────────────────────────────────

export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  city: string;
  avatarUrl?: string;
  linkedElderId: string;
  linkedElderName: string;
  notificationPreferences: {
    missedVisitAlert: boolean;
    visitSummary: boolean;
    photoSharing: boolean;
    weeklyDigest: boolean;
  };
}

export type VisitMood = 'great' | 'good' | 'okay' | 'low';

export interface TaskItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface VisitPhoto {
  id: string;
  caption?: string;
  consentGiven: boolean;
}

export interface VisitNote {
  id: string;
  bookingId: string;
  helperId: string;
  helperName: string;
  elderId: string;
  date: string;
  service: ServiceType;
  summary: string;
  mood: VisitMood;
  tasksCompleted: TaskItem[];
  photos?: VisitPhoto[];
  duration: number;
}

export type AlertSeverity = 'info' | 'warning' | 'urgent';
export type AlertType = 'missed_visit' | 'schedule_change' | 'helper_change' | 'wellness_note' | 'photo_shared';

export interface FamilyAlert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  severity: AlertSeverity;
  linkedBookingId?: string;
}

export interface CareTeamMember {
  helperId: string;
  helperName: string;
  role: 'primary' | 'backup';
  services: ServiceType[];
  rating: number;
  lastVisit?: string;
}

// ─── Continuity Engine ─────────────────────────────────────

export interface RecurringSchedule {
  id: string;
  elderId: string;
  elderName: string;
  primaryHelperId: string;
  primaryHelperName: string;
  backupHelperId?: string;
  backupHelperName?: string;
  service: ServiceType;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  frequency: 'weekly' | 'biweekly';
  isActive: boolean;
  startedDate: string;
  totalSessions: number;
}

export interface RegularHelper {
  helperId: string;
  helperName: string;
  services: ServiceType[];
  totalVisits: number;
  lastVisit: string;
  nextVisit?: string;
  rating: number;
  isRecurring: boolean;
}

// ─── Care Bundles ──────────────────────────────────────────

export interface CareBundle {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  services: { service: ServiceType; hoursPerWeek: number }[];
  weeklyPrice: number;
  regularPrice: number;
  savingsPercent: number;
  popular?: boolean;
}

// ─── Transportation Safety ─────────────────────────────────

export interface TripLog {
  id: string;
  bookingId: string;
  pickup: string;
  destination: string;
  pickupTime: string;
  dropoffTime: string;
  duration: number;
  waitAndAccompany: boolean;
  helperName: string;
  status: 'in_progress' | 'completed';
}
