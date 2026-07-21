/**
 * Comprehensive Detailed Test Suite for Nexus Platform
 * Tests Database Connectivity, Route Endpoints, and Component Integrity
 */
import pg from 'pg';
import http from 'http';

const BASE_URL = 'http://localhost:3000';

const DB_CONFIG = {
  host: 'db.wonzuboufzbnqcdidyjd.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Nx$u5Ev3nt@2025Db',
  ssl: { rejectUnauthorized: false },
};

function checkRoute(path) {
  return new Promise((resolve) => {
    const start = Date.now();
    http.get(`${BASE_URL}${path}`, (res) => {
      const duration = Date.now() - start;
      resolve({
        path,
        statusCode: res.statusCode,
        statusText: res.statusCode === 200 ? 'OK' : res.statusCode === 307 ? 'REDIRECT' : 'ERROR',
        durationMs: duration,
      });
    }).on('error', (err) => {
      resolve({
        path,
        statusCode: 0,
        statusText: `FAIL: ${err.message}`,
        durationMs: 0,
      });
    });
  });
}

console.log('============== 🧪 DETAILED NEXUS TEST SUITE ==============\n');

// 1. Test Database Tables & Data
console.log('1️⃣ TESTING SUPABASE POSTGRES DATABASE...');
const client = new pg.Client(DB_CONFIG);

try {
  await client.connect();
  console.log('  ✅ Database connection: OK');

  const tables = ['users', 'user_preferences', 'interests', 'user_interests', 'events', 'event_participants', 'profile_views'];
  for (const t of tables) {
    const res = await client.query(`SELECT count(*) FROM public.${t}`);
    console.log(`  📊 Table 'public.${t}': ${res.rows[0].count} records`);
  }

  // Check demo events
  const eventsRes = await client.query(`SELECT join_code, title, category FROM public.events`);
  console.log('\n  🎪 Demo Events in Database:');
  eventsRes.rows.forEach(e => console.log(`     • Code [${e.join_code}] — ${e.title} (${e.category})`));

  // Check interests
  const interestsRes = await client.query(`SELECT count(*) FROM public.interests`);
  console.log(`\n  🌱 Seeded Interests Count: ${interestsRes.rows[0].count}`);

  await client.end();
  console.log('\n  ✅ Database tests completed successfully!\n');
} catch (err) {
  console.error('  ❌ Database test failed:', err.message);
}

// 2. Test HTTP Routes & Pages
console.log('2️⃣ TESTING APPLICATION HTTP ROUTES...');
const routesToTest = [
  '/',
  '/login',
  '/onboarding',
  '/dashboard',
  '/events/join',
  '/events/demo-1/nearby',
  '/events/demo-1/heatmap',
  '/events/demo-1/recap',
  '/profile/me',
  '/settings',
  '/site.webmanifest',
];

for (const route of routesToTest) {
  const result = await checkRoute(route);
  const icon = result.statusCode === 200 || result.statusCode === 307 ? '✅' : '❌';
  console.log(`  ${icon} [${result.statusCode}] ${result.path.padEnd(25)} (${result.durationMs}ms)`);
}

console.log('\n==========================================================');
console.log('🎉 ALL DETAILED TESTS COMPLETED!');
