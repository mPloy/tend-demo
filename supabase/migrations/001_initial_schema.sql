-- Tend — Initial Database Schema
-- Supabase (PostgreSQL) · AWS ca-central-1 (Montreal)
-- Run this in the Supabase SQL Editor after creating your project.

-- ═══════════════════════════════════════════════════════════
-- ENUM TYPES (matching types/index.ts)
-- ═══════════════════════════════════════════════════════════

CREATE TYPE user_role AS ENUM ('elder', 'helper', 'family');

CREATE TYPE service_type AS ENUM (
  'companionship', 'groceries', 'meal_prep', 'errands',
  'housekeeping', 'transportation', 'garden', 'tech_help',
  'pet_care', 'overnight'
);

CREATE TYPE booking_status AS ENUM (
  'pending', 'confirmed', 'active', 'completed', 'cancelled'
);

CREATE TYPE gender_type AS ENUM ('male', 'female', 'non_binary');

CREATE TYPE age_group AS ENUM ('20-30', '30-40', '40-50', '50-60', '60-70');

CREATE TYPE verification_level AS ENUM ('basic', 'enhanced', 'premium');

CREATE TYPE verification_check_type AS ENUM (
  'id_passport', 'id_drivers_license', 'criminal_record_check',
  'criminal_record_review', 'worksafebc_coverage', 'pipa_consent',
  'first_aid', 'reference_check'
);

CREATE TYPE verification_status AS ENUM ('cleared', 'pending', 'expired', 'not_submitted');

CREATE TYPE visit_mood AS ENUM ('great', 'good', 'okay', 'low');

CREATE TYPE alert_severity AS ENUM ('info', 'warning', 'urgent');

CREATE TYPE alert_type AS ENUM (
  'missed_visit', 'schedule_change', 'helper_change',
  'wellness_note', 'photo_shared'
);

CREATE TYPE care_team_role AS ENUM ('primary', 'backup');

CREATE TYPE schedule_frequency AS ENUM ('weekly', 'biweekly');

CREATE TYPE trip_status AS ENUM ('in_progress', 'completed');


-- ═══════════════════════════════════════════════════════════
-- CORE TABLES
-- ═══════════════════════════════════════════════════════════

-- Shared profile (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  street_address TEXT,
  city TEXT DEFAULT 'Vancouver',
  province TEXT DEFAULT 'BC',
  postal_code TEXT,
  avatar_url TEXT,
  bio TEXT,
  member_since TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Elder-specific data
CREATE TABLE elder_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  rating NUMERIC(2,1) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  needs service_type[] DEFAULT '{}',
  preferences JSONB DEFAULT '{"genderPreference":"no_preference","ageGroupPreference":"no_preference"}'
);

-- Helper-specific data
CREATE TABLE helper_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  gender gender_type,
  age_group age_group,
  headline TEXT,
  cover_photo_url TEXT,
  special_skills TEXT[] DEFAULT '{}',
  has_car BOOLEAN DEFAULT false,
  languages TEXT[] DEFAULT '{}',
  verification_level verification_level DEFAULT 'basic',
  id_verified BOOLEAN DEFAULT false,
  background_checked BOOLEAN DEFAULT false,
  references_verified INT DEFAULT 0,
  rating NUMERIC(2,1) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  repeat_clients INT DEFAULT 0,
  completed_bookings INT DEFAULT 0,
  response_time TEXT DEFAULT '~2 hours',
  availability JSONB DEFAULT '{
    "monday":false,"tuesday":false,"wednesday":false,
    "thursday":false,"friday":false,"saturday":false,"sunday":false
  }'
);

-- Family member-specific data
CREATE TABLE family_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  relationship TEXT,
  linked_elder_id UUID REFERENCES profiles(id),
  notification_preferences JSONB DEFAULT '{
    "missedVisitAlert":true,"visitSummary":true,
    "photoSharing":true,"weeklyDigest":false
  }'
);

-- Service reference table
CREATE TABLE services (
  type service_type PRIMARY KEY,
  label TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL
);

-- Seed service reference data
INSERT INTO services (type, label, icon, color) VALUES
  ('companionship', 'Companionship', 'heart', '#E84393'),
  ('groceries', 'Groceries', 'cart', '#00B894'),
  ('meal_prep', 'Meal Prep', 'restaurant', '#FDCB6E'),
  ('errands', 'Errands', 'bicycle', '#6C5CE7'),
  ('housekeeping', 'Housekeeping', 'home', '#00CEC9'),
  ('transportation', 'Transportation', 'bus', '#0984E3'),
  ('garden', 'Garden', 'flower', '#55A630'),
  ('tech_help', 'Tech Help', 'phone-portrait', '#636E72'),
  ('pet_care', 'Pet Care', 'paw', '#E17055'),
  ('overnight', 'Overnight', 'moon', '#2D3436');


-- ═══════════════════════════════════════════════════════════
-- MARKETPLACE TABLES
-- ═══════════════════════════════════════════════════════════

-- Helper service rates (junction)
CREATE TABLE helper_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  helper_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service service_type NOT NULL,
  rate_per_hour NUMERIC(6,2) NOT NULL,
  UNIQUE(helper_id, service)
);

-- Favorite helpers (elder → helper)
CREATE TABLE favorite_helpers (
  elder_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  helper_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (elder_id, helper_id)
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  elder_id UUID NOT NULL REFERENCES profiles(id),
  helper_id UUID NOT NULL REFERENCES profiles(id),
  service service_type NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration NUMERIC(4,1) NOT NULL,
  total_cost NUMERIC(8,2) NOT NULL,
  status booking_status DEFAULT 'pending',
  notes TEXT,
  elder_rating SMALLINT CHECK (elder_rating BETWEEN 1 AND 5),
  helper_rating SMALLINT CHECK (helper_rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES profiles(id),
  to_user_id UUID NOT NULL REFERENCES profiles(id),
  from_user_role user_role NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  service service_type NOT NULL,
  booking_id UUID REFERENCES bookings(id),
  created_at TIMESTAMPTZ DEFAULT now()
);


-- ═══════════════════════════════════════════════════════════
-- MESSAGING TABLES
-- ═══════════════════════════════════════════════════════════

CREATE TABLE message_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE thread_participants (
  thread_id UUID REFERENCES message_threads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  unread_count INT DEFAULT 0,
  PRIMARY KEY (thread_id, user_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  text TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);


-- ═══════════════════════════════════════════════════════════
-- FAMILY DASHBOARD TABLES
-- ═══════════════════════════════════════════════════════════

-- Visit notes
CREATE TABLE visit_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  helper_id UUID NOT NULL REFERENCES profiles(id),
  elder_id UUID NOT NULL REFERENCES profiles(id),
  date DATE NOT NULL,
  service service_type NOT NULL,
  summary TEXT,
  mood visit_mood,
  duration NUMERIC(4,1),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Visit note task checklist items
CREATE TABLE visit_note_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_note_id UUID NOT NULL REFERENCES visit_notes(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0
);

-- Visit photos (with consent tracking)
CREATE TABLE visit_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_note_id UUID NOT NULL REFERENCES visit_notes(id) ON DELETE CASCADE,
  storage_path TEXT,
  caption TEXT,
  consent_given BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Family alerts
CREATE TABLE family_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES profiles(id),
  elder_id UUID NOT NULL REFERENCES profiles(id),
  type alert_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  severity alert_severity DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  linked_booking_id UUID REFERENCES bookings(id),
  created_at TIMESTAMPTZ DEFAULT now()
);


-- ═══════════════════════════════════════════════════════════
-- CONTINUITY ENGINE TABLES
-- ═══════════════════════════════════════════════════════════

-- Care team members
CREATE TABLE care_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  elder_id UUID NOT NULL REFERENCES profiles(id),
  helper_id UUID NOT NULL REFERENCES profiles(id),
  role care_team_role NOT NULL,
  services service_type[] DEFAULT '{}',
  last_visit DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(elder_id, helper_id)
);

-- Recurring schedules
CREATE TABLE recurring_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  elder_id UUID NOT NULL REFERENCES profiles(id),
  primary_helper_id UUID NOT NULL REFERENCES profiles(id),
  backup_helper_id UUID REFERENCES profiles(id),
  service service_type NOT NULL,
  day_of_week TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  frequency schedule_frequency DEFAULT 'weekly',
  is_active BOOLEAN DEFAULT true,
  started_date DATE,
  total_sessions INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);


-- ═══════════════════════════════════════════════════════════
-- TRUST STACK TABLES (BC-SPECIFIC)
-- ═══════════════════════════════════════════════════════════

-- Verification records
CREATE TABLE verification_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  helper_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type verification_check_type NOT NULL,
  status verification_status DEFAULT 'not_submitted',
  verified_date DATE,
  expiry_date DATE,
  description TEXT,
  issuing_authority TEXT,
  document_storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Quality scores (one per helper)
CREATE TABLE quality_scores (
  helper_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  overall SMALLINT DEFAULT 0,
  punctuality SMALLINT DEFAULT 0,
  communication SMALLINT DEFAULT 0,
  task_completion SMALLINT DEFAULT 0,
  elder_satisfaction SMALLINT DEFAULT 0,
  first_visit_callback_completed BOOLEAN DEFAULT false,
  last_spot_check_date DATE,
  escalation_contact_available BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Transport safety (one per helper)
CREATE TABLE transport_safety (
  helper_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  driver_verified BOOLEAN DEFAULT false,
  insurance_attested BOOLEAN DEFAULT false,
  insurance_expiry_date DATE,
  vehicle_year INT,
  vehicle_make TEXT,
  wait_and_accompany_available BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);


-- ═══════════════════════════════════════════════════════════
-- CARE BUNDLES
-- ═══════════════════════════════════════════════════════════

CREATE TABLE care_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  icon TEXT,
  color TEXT,
  weekly_price NUMERIC(8,2),
  regular_price NUMERIC(8,2),
  savings_percent SMALLINT,
  popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE care_bundle_services (
  bundle_id UUID REFERENCES care_bundles(id) ON DELETE CASCADE,
  service service_type NOT NULL,
  hours_per_week NUMERIC(4,1) NOT NULL,
  PRIMARY KEY (bundle_id, service)
);


-- ═══════════════════════════════════════════════════════════
-- TRANSPORTATION
-- ═══════════════════════════════════════════════════════════

CREATE TABLE trip_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  helper_id UUID NOT NULL REFERENCES profiles(id),
  pickup TEXT,
  destination TEXT,
  pickup_time TIMESTAMPTZ,
  dropoff_time TIMESTAMPTZ,
  duration INT, -- minutes
  wait_and_accompany BOOLEAN DEFAULT false,
  status trip_status DEFAULT 'in_progress',
  created_at TIMESTAMPTZ DEFAULT now()
);


-- ═══════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_postal_code ON profiles(postal_code);
CREATE INDEX idx_bookings_elder ON bookings(elder_id);
CREATE INDEX idx_bookings_helper ON bookings(helper_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_messages_thread ON messages(thread_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at);
CREATE INDEX idx_thread_participants_user ON thread_participants(user_id);
CREATE INDEX idx_visit_notes_elder ON visit_notes(elder_id);
CREATE INDEX idx_visit_notes_helper ON visit_notes(helper_id);
CREATE INDEX idx_family_alerts_family ON family_alerts(family_id);
CREATE INDEX idx_family_alerts_elder ON family_alerts(elder_id);
CREATE INDEX idx_care_team_elder ON care_team_members(elder_id);
CREATE INDEX idx_recurring_elder ON recurring_schedules(elder_id);
CREATE INDEX idx_verification_helper ON verification_records(helper_id);
CREATE INDEX idx_helper_services_helper ON helper_services(helper_id);
CREATE INDEX idx_reviews_to_user ON reviews(to_user_id);
CREATE INDEX idx_family_linked_elder ON family_profiles(linked_elder_id);


-- ═══════════════════════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════════════════════

-- Auto-create profile + role-specific row on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'elder')::user_role,
    COALESCE(NEW.raw_user_meta_data->>'firstName', ''),
    COALESCE(NEW.raw_user_meta_data->>'lastName', '')
  );

  -- Create role-specific profile
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'elder') = 'elder' THEN
    INSERT INTO elder_profiles (id) VALUES (NEW.id);
  ELSIF NEW.raw_user_meta_data->>'role' = 'helper' THEN
    INSERT INTO helper_profiles (id) VALUES (NEW.id);
  ELSIF NEW.raw_user_meta_data->>'role' = 'family' THEN
    INSERT INTO family_profiles (id) VALUES (NEW.id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER quality_scores_updated_at
  BEFORE UPDATE ON quality_scores FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER transport_safety_updated_at
  BEFORE UPDATE ON transport_safety FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ═══════════════════════════════════════════════════════════
-- RLS HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_family_of(elder_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM family_profiles
    WHERE id = auth.uid() AND linked_elder_id = elder_uuid
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ═══════════════════════════════════════════════════════════
-- ROW-LEVEL SECURITY POLICIES
-- ═══════════════════════════════════════════════════════════

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "System inserts profiles via trigger"
  ON profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- elder_profiles
ALTER TABLE elder_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read elder profiles"
  ON elder_profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR get_user_role() = 'helper' OR is_family_of(id));
CREATE POLICY "Update own elder profile"
  ON elder_profiles FOR UPDATE TO authenticated USING (id = auth.uid());

-- helper_profiles
ALTER TABLE helper_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Helper profiles are publicly readable"
  ON helper_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Update own helper profile"
  ON helper_profiles FOR UPDATE TO authenticated USING (id = auth.uid());

-- family_profiles
ALTER TABLE family_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own family profile"
  ON family_profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Update own family profile"
  ON family_profiles FOR UPDATE TO authenticated USING (id = auth.uid());

-- helper_services
ALTER TABLE helper_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Helper services are publicly readable"
  ON helper_services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Helpers manage own services"
  ON helper_services FOR ALL TO authenticated
  USING (helper_id = auth.uid());

-- favorite_helpers
ALTER TABLE favorite_helpers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Elders manage own favorites"
  ON favorite_helpers FOR ALL TO authenticated
  USING (elder_id = auth.uid());

-- bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read bookings"
  ON bookings FOR SELECT TO authenticated
  USING (
    elder_id = auth.uid()
    OR helper_id = auth.uid()
    OR is_family_of(elder_id)
    OR (status = 'pending' AND get_user_role() = 'helper')
  );
CREATE POLICY "Elders create bookings"
  ON bookings FOR INSERT TO authenticated
  WITH CHECK (elder_id = auth.uid());
CREATE POLICY "Participants update bookings"
  ON bookings FOR UPDATE TO authenticated
  USING (elder_id = auth.uid() OR helper_id = auth.uid());

-- reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are publicly readable"
  ON reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create reviews"
  ON reviews FOR INSERT TO authenticated
  WITH CHECK (from_user_id = auth.uid());

-- message_threads
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read threads I participate in"
  ON message_threads FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM thread_participants
    WHERE thread_id = message_threads.id AND user_id = auth.uid()
  ));
CREATE POLICY "Create message threads"
  ON message_threads FOR INSERT TO authenticated WITH CHECK (true);

-- thread_participants
ALTER TABLE thread_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own thread participation"
  ON thread_participants FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM thread_participants tp
    WHERE tp.thread_id = thread_participants.thread_id AND tp.user_id = auth.uid()
  ));
CREATE POLICY "Add participants to threads I'm in"
  ON thread_participants FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Update own unread count"
  ON thread_participants FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read messages in my threads"
  ON messages FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM thread_participants
    WHERE thread_id = messages.thread_id AND user_id = auth.uid()
  ));
CREATE POLICY "Send messages to my threads"
  ON messages FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM thread_participants
      WHERE thread_id = messages.thread_id AND user_id = auth.uid()
    )
  );

-- visit_notes
ALTER TABLE visit_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read visit notes"
  ON visit_notes FOR SELECT TO authenticated
  USING (helper_id = auth.uid() OR elder_id = auth.uid() OR is_family_of(elder_id));
CREATE POLICY "Helpers create visit notes"
  ON visit_notes FOR INSERT TO authenticated
  WITH CHECK (helper_id = auth.uid());

-- visit_note_tasks
ALTER TABLE visit_note_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read visit note tasks"
  ON visit_note_tasks FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM visit_notes
    WHERE visit_notes.id = visit_note_tasks.visit_note_id
    AND (visit_notes.helper_id = auth.uid() OR visit_notes.elder_id = auth.uid() OR is_family_of(visit_notes.elder_id))
  ));
CREATE POLICY "Helpers create visit note tasks"
  ON visit_note_tasks FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM visit_notes
    WHERE visit_notes.id = visit_note_tasks.visit_note_id AND visit_notes.helper_id = auth.uid()
  ));

-- visit_photos
ALTER TABLE visit_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read visit photos"
  ON visit_photos FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM visit_notes
    WHERE visit_notes.id = visit_photos.visit_note_id
    AND (visit_notes.helper_id = auth.uid() OR visit_notes.elder_id = auth.uid() OR is_family_of(visit_notes.elder_id))
  ));
CREATE POLICY "Helpers upload visit photos"
  ON visit_photos FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM visit_notes
    WHERE visit_notes.id = visit_photos.visit_note_id AND visit_notes.helper_id = auth.uid()
  ));

-- family_alerts
ALTER TABLE family_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Family reads own alerts"
  ON family_alerts FOR SELECT TO authenticated
  USING (family_id = auth.uid());
CREATE POLICY "Family marks alerts read"
  ON family_alerts FOR UPDATE TO authenticated
  USING (family_id = auth.uid());

-- care_team_members
ALTER TABLE care_team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read care team"
  ON care_team_members FOR SELECT TO authenticated
  USING (
    elder_id = auth.uid()
    OR helper_id = auth.uid()
    OR is_family_of(elder_id)
  );
CREATE POLICY "Elders manage care team"
  ON care_team_members FOR ALL TO authenticated
  USING (elder_id = auth.uid());

-- recurring_schedules
ALTER TABLE recurring_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read recurring schedules"
  ON recurring_schedules FOR SELECT TO authenticated
  USING (
    elder_id = auth.uid()
    OR primary_helper_id = auth.uid()
    OR backup_helper_id = auth.uid()
    OR is_family_of(elder_id)
  );
CREATE POLICY "Elders manage recurring schedules"
  ON recurring_schedules FOR ALL TO authenticated
  USING (elder_id = auth.uid());

-- verification_records
ALTER TABLE verification_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Verification records are publicly readable"
  ON verification_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Helpers manage own verification"
  ON verification_records FOR ALL TO authenticated
  USING (helper_id = auth.uid());

-- quality_scores
ALTER TABLE quality_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Quality scores are publicly readable"
  ON quality_scores FOR SELECT TO authenticated USING (true);

-- transport_safety
ALTER TABLE transport_safety ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Transport safety is publicly readable"
  ON transport_safety FOR SELECT TO authenticated USING (true);
CREATE POLICY "Helpers manage own transport safety"
  ON transport_safety FOR ALL TO authenticated
  USING (helper_id = auth.uid());

-- care_bundles
ALTER TABLE care_bundles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active bundles are publicly readable"
  ON care_bundles FOR SELECT TO authenticated USING (is_active = true);

-- care_bundle_services
ALTER TABLE care_bundle_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bundle services are publicly readable"
  ON care_bundle_services FOR SELECT TO authenticated USING (true);

-- trip_logs
ALTER TABLE trip_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read trip logs"
  ON trip_logs FOR SELECT TO authenticated
  USING (
    helper_id = auth.uid()
    OR EXISTS (SELECT 1 FROM bookings WHERE bookings.id = trip_logs.booking_id AND bookings.elder_id = auth.uid())
    OR EXISTS (SELECT 1 FROM bookings WHERE bookings.id = trip_logs.booking_id AND is_family_of(bookings.elder_id))
  );
CREATE POLICY "Helpers create trip logs"
  ON trip_logs FOR INSERT TO authenticated
  WITH CHECK (helper_id = auth.uid());

-- services (reference table)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services are publicly readable"
  ON services FOR SELECT TO authenticated USING (true);


-- ═══════════════════════════════════════════════════════════
-- REALTIME (enable for messaging)
-- ═══════════════════════════════════════════════════════════

ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE family_alerts;
