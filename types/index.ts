// Tend — Rover-style Elder Care Companion Marketplace

export type UserRole = 'elder' | 'helper';

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
  city: string;
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
  city: string;
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
