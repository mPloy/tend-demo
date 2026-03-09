/**
 * Tend — Database Seed Script
 *
 * Populates a fresh Supabase database with mock data from constants/MockData.ts.
 * Uses the Supabase service role key to bypass RLS for admin inserts.
 *
 * Usage:
 *   SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=eyJ... npx tsx scripts/seed.ts
 *
 * Prerequisites:
 *   - Run supabase/migrations/001_initial_schema.sql first
 *   - Requires @supabase/supabase-js installed (already in project)
 */
import { createClient } from '@supabase/supabase-js';

// Import all mock data
import {
  elders,
  helpers,
  bookings,
  reviews,
  messageThreads,
  familyMembers,
  visitNotes,
  familyAlerts,
  careTeamMembers,
  recurringSchedules,
  regularHelpers,
  careBundles,
  tripLogs,
} from '../constants/MockData';

// ── Config ──────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing environment variables.');
  console.error('   Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Helpers ─────────────────────────────────────────────────
async function upsert(table: string, rows: any[]) {
  if (rows.length === 0) return;
  const { error } = await supabase.from(table).upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error(`  ❌ ${table}: ${error.message}`);
  } else {
    console.log(`  ✓ ${table}: ${rows.length} rows`);
  }
}

async function insert(table: string, rows: any[]) {
  if (rows.length === 0) return;
  const { error } = await supabase.from(table).insert(rows);
  if (error) {
    console.error(`  ❌ ${table}: ${error.message}`);
  } else {
    console.log(`  ✓ ${table}: ${rows.length} rows`);
  }
}

// ── Create Auth Users ───────────────────────────────────────
async function createAuthUser(email: string, password: string, id: string, metadata: Record<string, any>) {
  // Create user via admin API
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: metadata,
    // Use the mock ID so foreign keys align
  });

  if (error) {
    if (error.message.includes('already been registered')) {
      console.log(`  ⚠ User ${email} already exists`);
      return null;
    }
    console.error(`  ❌ Auth user ${email}: ${error.message}`);
    return null;
  }

  console.log(`  ✓ Auth user: ${email} (${data.user.id})`);
  return data.user.id;
}

// ── Seed Functions ──────────────────────────────────────────

async function seedProfiles() {
  console.log('\n📋 Seeding profiles...');

  // Create auth users for elders
  for (const elder of elders) {
    const email = `${elder.firstName.toLowerCase()}.${elder.lastName.toLowerCase()}@tend-demo.ca`;
    const authId = await createAuthUser(email, 'demo123456', elder.id, {
      role: 'elder',
      firstName: elder.firstName,
      lastName: elder.lastName,
    });

    if (authId) {
      // Insert profile
      await upsert('profiles', [{
        id: authId,
        role: 'elder',
        first_name: elder.firstName,
        last_name: elder.lastName,
        street_address: elder.streetAddress,
        city: elder.city,
        province: elder.province,
        postal_code: elder.postalCode,
        bio: elder.bio,
      }]);

      // Insert elder-specific profile
      await upsert('elder_profiles', [{
        id: authId,
        needs: elder.needs,
        preferences: elder.preferences || {},
      }]);
    }
  }

  // Create auth users for helpers
  for (const helper of helpers) {
    const email = `${helper.firstName.toLowerCase()}.${helper.lastName.toLowerCase()}@tend-demo.ca`;
    const authId = await createAuthUser(email, 'demo123456', helper.id, {
      role: 'helper',
      firstName: helper.firstName,
      lastName: helper.lastName,
    });

    if (authId) {
      await upsert('profiles', [{
        id: authId,
        role: 'helper',
        first_name: helper.firstName,
        last_name: helper.lastName,
        street_address: helper.streetAddress,
        city: helper.city,
        province: helper.province,
        postal_code: helper.postalCode,
        bio: helper.bio,
      }]);

      await upsert('helper_profiles', [{
        id: authId,
        gender: helper.gender,
        age_group: helper.ageGroup,
        headline: helper.headline,
        skills: helper.specialSkills,
        languages: helper.languages,
        verification_level: helper.verificationLevel,
        id_verified: helper.idVerified,
        background_checked: helper.backgroundChecked,
        references_verified: helper.referencesVerified,
        rating: helper.rating,
        total_reviews: helper.totalReviews,
        completed_bookings: helper.completedBookings,
        repeat_clients: helper.repeatClients,
        response_time: helper.responseTime,
        member_since: helper.memberSince,
        has_car: helper.hasCar,
      }]);

      // Insert helper services (rates)
      if (helper.services && helper.services.length > 0) {
        await insert('helper_services', helper.services.map((s) => ({
          helper_id: authId,
          service: s.service,
          rate_per_hour: s.ratePerHour,
        })));
      }

      // Insert verification records
      if (helper.verificationRecords && helper.verificationRecords.length > 0) {
        await insert('verification_records', helper.verificationRecords.map((vr) => ({
          helper_id: authId,
          type: vr.type,
          status: vr.status,
          verified_date: vr.verifiedDate,
          expiry_date: vr.expiryDate || null,
          issuing_authority: vr.issuingAuthority,
          document_number: vr.documentNumber || null,
        })));
      }

      // Insert quality score
      if (helper.qualityScore) {
        await upsert('quality_scores', [{
          helper_id: authId,
          overall: helper.qualityScore.overall,
          punctuality: helper.qualityScore.punctuality,
          communication: helper.qualityScore.communication,
          skill_level: helper.qualityScore.skillLevel,
          reliability: helper.qualityScore.reliability,
          empathy: helper.qualityScore.empathy,
          last_audit_date: helper.qualityScore.lastAuditDate,
          auditor_name: helper.qualityScore.auditorName,
        }]);
      }

      // Insert transport safety
      if (helper.transportSafety) {
        await upsert('transport_safety', [{
          helper_id: authId,
          has_valid_license: helper.transportSafety.hasValidLicense,
          license_class: helper.transportSafety.licenseClass,
          license_expiry: helper.transportSafety.licenseExpiry,
          has_insurance: helper.transportSafety.hasInsurance,
          insurance_expiry: helper.transportSafety.insuranceExpiry,
          vehicle_year: helper.transportSafety.vehicleYear,
          vehicle_make: helper.transportSafety.vehicleMake,
          vehicle_model: helper.transportSafety.vehicleModel,
          vehicle_safety_inspection: helper.transportSafety.vehicleSafetyInspection,
          clean_driving_record: helper.transportSafety.cleanDrivingRecord,
        }]);
      }
    }
  }

  // Create auth users for family members
  for (const family of familyMembers) {
    const email = `${family.firstName.toLowerCase()}.${family.lastName.toLowerCase()}@tend-demo.ca`;
    const authId = await createAuthUser(email, 'demo123456', family.id, {
      role: 'family',
      firstName: family.firstName,
      lastName: family.lastName,
    });

    if (authId) {
      await upsert('profiles', [{
        id: authId,
        role: 'family',
        first_name: family.firstName,
        last_name: family.lastName,
        city: family.city,
        province: family.province,
        postal_code: family.postalCode,
      }]);

      // Family profile needs the linked elder's auth ID
      // For now, insert with the mock ID — will need manual mapping
      await upsert('family_profiles', [{
        id: authId,
        relationship: family.relationship,
        linked_elder_name: family.linkedElderName,
        notification_preferences: family.notificationPreferences || {},
      }]);
    }
  }
}

async function seedBookings() {
  console.log('\n📅 Seeding bookings...');
  // Note: In production, elder_id and helper_id would be real auth UUIDs.
  // This seed script uses mock IDs for reference; you'll need to map them
  // to real auth user IDs after creating auth users.
  console.log('  ⚠ Bookings seed requires auth user ID mapping (manual step)');
}

async function seedReviews() {
  console.log('\n⭐ Seeding reviews...');
  console.log('  ⚠ Reviews seed requires auth user ID mapping (manual step)');
}

async function seedMessages() {
  console.log('\n💬 Seeding messages...');
  console.log('  ⚠ Messages seed requires auth user ID mapping (manual step)');
}

async function seedCareBundles() {
  console.log('\n📦 Seeding care bundles...');

  const bundleRows = careBundles.map((b) => ({
    id: b.id,
    name: b.name,
    description: b.description,
    weekly_price: b.weeklyPrice,
    monthly_price: b.monthlyPrice,
    popular: b.popular,
  }));
  await upsert('care_bundles', bundleRows);

  // Bundle services
  const serviceRows = careBundles.flatMap((b) =>
    b.services.map((s) => ({
      bundle_id: b.id,
      service: s.service,
      hours_per_week: s.hoursPerWeek,
    }))
  );
  await insert('care_bundle_services', serviceRows);
}

// ── Main ────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Tend Database Seeder');
  console.log('========================');
  console.log(`Target: ${SUPABASE_URL}`);

  await seedProfiles();
  await seedCareBundles();
  await seedBookings();
  await seedReviews();
  await seedMessages();

  console.log('\n✅ Seed complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Note the auth user UUIDs created above');
  console.log('   2. Map mock IDs to real UUIDs for bookings, reviews, messages');
  console.log('   3. Or use the app to create bookings/messages naturally');
  console.log('\n🔑 Demo credentials:');
  console.log('   Elder: margaret.chen@tend-demo.ca / demo123456');
  console.log('   Helper: sarah.williams@tend-demo.ca / demo123456');
  console.log('   Family: jennifer.chen@tend-demo.ca / demo123456');
}

main().catch(console.error);
