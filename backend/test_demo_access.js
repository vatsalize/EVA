import app from './src/server.js';
import { env } from './src/config/env.js';
import { query } from './src/config/db.js';
import jwt from 'jsonwebtoken';
import {
  verifyDemoPassword,
  verifyDemoAccessToken,
  resetDemoRateLimit,
  isDemoCoordinatorAccount,
  PREDEFINED_DEMO_COORDINATOR_IDS
} from './src/modules/auth/demoAccess.service.js';

let server;
let baseUrl;

async function startServer() {
  return new Promise((resolve, reject) => {
    // Listen on port 0 to choose an ephemeral free port
    server = app.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
    server.on('error', reject);
  });
}

function stopServer() {
  return new Promise((resolve) => {
    if (server) {
      server.close(resolve);
    } else {
      resolve();
    }
  });
}

const results = [];

function recordTest(name, passed, details = '') {
  results.push({ name, passed, details });
  const status = passed ? 'PASS' : 'FAIL';
  console.log(`[${status}] ${name}${details ? ` -> ${details}` : ''}`);
}

async function runTests() {
  console.log('====================================================');
  console.log('  EVA Coordinator Demo Access Security Test Suite   ');
  console.log('====================================================\n');

  await startServer();

  try {
    // Reset rate limiter for test runner IP
    resetDemoRateLimit('127.0.0.1');

    // -------------------------------------------------------------------------
    // Test 1: Coordinator demo status check
    // -------------------------------------------------------------------------
    {
      const res = await fetch(`${baseUrl}/api/auth/coordinator-demo-status`);
      const body = await res.json();
      const passed = res.status === 200 &&
                     body.success === true &&
                     body.isConfigured === true &&
                     body.password === undefined;
      recordTest(
        'Test 1: Coordinator demo status check',
        passed,
        `Status ${res.status}, isConfigured=${body.isConfigured}`
      );
    }

    // -------------------------------------------------------------------------
    // Test 2: Submit incorrect password -> Access denied (401)
    // -------------------------------------------------------------------------
    {
      const res = await fetch(`${baseUrl}/api/auth/coordinator-demo-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'WrongPassword999!' })
      });
      const body = await res.json();
      const passed = res.status === 401 &&
                     body.success === false &&
                     body.message.includes('Incorrect access password');
      recordTest(
        'Test 2: Submit incorrect password',
        passed,
        `Status ${res.status}, message: "${body.message}"`
      );
    }

    // -------------------------------------------------------------------------
    // Test 3: Submit correct password -> Access granted & token issued (200)
    // -------------------------------------------------------------------------
    let demoToken = null;
    let demoAccounts = null;
    let defaultPass = null;
    {
      resetDemoRateLimit('127.0.0.1');
      const res = await fetch(`${baseUrl}/api/auth/coordinator-demo-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: env.EVA_COORDINATOR_DEMO_ACCESS_PASSWORD })
      });
      const body = await res.json();
      demoToken = body.demoAccessToken;
      demoAccounts = body.accounts;
      defaultPass = body.defaultPassword;

      const passed = res.status === 200 &&
                     body.success === true &&
                     typeof demoToken === 'string' &&
                     Array.isArray(demoAccounts) &&
                     demoAccounts.length >= 6 &&
                     defaultPass === 'EVA-Demo@2026';
      recordTest(
        'Test 3: Submit correct password',
        passed,
        `Status ${res.status}, token received, ${demoAccounts?.length} accounts unlocked`
      );
    }

    // -------------------------------------------------------------------------
    // Test 4: Direct coordinator login to COO001 WITHOUT demo authorization (403)
    // -------------------------------------------------------------------------
    {
      const res = await fetch(`${baseUrl}/api/auth/coordinator/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coordinatorId: 'COO001',
          password: 'EVA-Demo@2026'
        })
      });
      const body = await res.json();
      const passed = res.status === 403 &&
                     body.success === false &&
                     body.message.includes('locked');
      recordTest(
        'Test 4: Direct API login to COO001 without demo token',
        passed,
        `Status ${res.status}, response: "${body.message}"`
      );
    }

    // -------------------------------------------------------------------------
    // Test 5: Direct coordinator login to COO001 with INVALID / TAMPERED token (403)
    // -------------------------------------------------------------------------
    {
      const res = await fetch(`${baseUrl}/api/auth/coordinator/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-demo-access-token': 'invalid.jwt.token.here'
        },
        body: JSON.stringify({
          coordinatorId: 'COO001',
          password: 'EVA-Demo@2026'
        })
      });
      const body = await res.json();
      const passed = res.status === 403 &&
                     body.success === false;
      recordTest(
        'Test 5: Direct API login with forged token',
        passed,
        `Status ${res.status}, rejected as expected`
      );
    }

    // -------------------------------------------------------------------------
    // Test 6: Direct coordinator login to COO001 with EXPIRED token (403)
    // -------------------------------------------------------------------------
    {
      // Create an expired token signed with server secret
      const expiredToken = jwt.sign(
        { scope: 'COORDINATOR_DEMO_ACCESS', purpose: 'owner_demo_unlock' },
        env.JWT_SECRET,
        { expiresIn: '-1s' }
      );
      const res = await fetch(`${baseUrl}/api/auth/coordinator/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-demo-access-token': expiredToken
        },
        body: JSON.stringify({
          coordinatorId: 'COO001',
          password: 'EVA-Demo@2026'
        })
      });
      const body = await res.json();
      const passed = res.status === 403 &&
                     body.success === false;
      recordTest(
        'Test 6: Direct API login with expired token',
        passed,
        `Status ${res.status}, rejection reason: "${body.reason}"`
      );
    }

    // -------------------------------------------------------------------------
    // Test 7: Coordinator login to COO001 WITH VALID demo authorization (200)
    // -------------------------------------------------------------------------
    {
      const res = await fetch(`${baseUrl}/api/auth/coordinator/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-demo-access-token': demoToken
        },
        body: JSON.stringify({
          coordinatorId: 'COO001',
          password: 'EVA-Demo@2026'
        })
      });
      const body = await res.json();
      const passed = res.status === 200 &&
                     body.success === true &&
                     body.user?.userId === 'COO001' &&
                     body.user?.role === 'COORDINATOR';
      recordTest(
        'Test 7: Coordinator login WITH valid demo token',
        passed,
        `Status ${res.status}, authenticated as ${body.user?.fullName} (${body.user?.userId})`
      );
    }

    // -------------------------------------------------------------------------
    // Test 8: Protected endpoint GET /api/auth/coordinator-demo-accounts
    // -------------------------------------------------------------------------
    {
      // A: Without token -> 401
      const resNoToken = await fetch(`${baseUrl}/api/auth/coordinator-demo-accounts`);
      const bodyNoToken = await resNoToken.json();

      // B: With valid token -> 200
      const resWithToken = await fetch(`${baseUrl}/api/auth/coordinator-demo-accounts`, {
        headers: { 'x-demo-access-token': demoToken }
      });
      const bodyWithToken = await resWithToken.json();

      const passed = resNoToken.status === 401 &&
                     bodyNoToken.success === false &&
                     resWithToken.status === 200 &&
                     Array.isArray(bodyWithToken.accounts) &&
                     bodyWithToken.accounts.length === 6;
      recordTest(
        'Test 8: Protected demo-accounts endpoint authorization check',
        passed,
        `No token=401, Valid token=200 (${bodyWithToken.accounts?.length} accounts)`
      );
    }

    // -------------------------------------------------------------------------
    // Test 9: Rate limiting & brute force lockout (HTTP 429)
    // -------------------------------------------------------------------------
    {
      resetDemoRateLimit('127.0.0.1');
      let finalStatus = 0;
      let finalBody = {};

      for (let i = 0; i < 6; i++) {
        const res = await fetch(`${baseUrl}/api/auth/coordinator-demo-access`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: `BadPass#${i}` })
        });
        finalStatus = res.status;
        finalBody = await res.json();
      }

      const passed = finalStatus === 429 &&
                     finalBody.success === false &&
                     typeof finalBody.retryAfterSec === 'number';
      recordTest(
        'Test 9: Rate limiting after repeated incorrect attempts',
        passed,
        `Status ${finalStatus}, retryAfterSec=${finalBody.retryAfterSec}`
      );
      resetDemoRateLimit('127.0.0.1'); // Clean up
    }

    // -------------------------------------------------------------------------
    // Test 10: Missing environment variable behavior
    // -------------------------------------------------------------------------
    {
      const currentEnvVal = env.EVA_COORDINATOR_DEMO_ACCESS_PASSWORD;
      env.EVA_COORDINATOR_DEMO_ACCESS_PASSWORD = '';

      const check = verifyDemoPassword('any_arbitrary_attempt');

      const res = await fetch(`${baseUrl}/api/auth/coordinator-demo-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'any_arbitrary_attempt' })
      });
      const body = await res.json();

      env.EVA_COORDINATOR_DEMO_ACCESS_PASSWORD = currentEnvVal; // Restore

      const passed = check.disabled === true &&
                     res.status === 503 &&
                     body.success === false;
      recordTest(
        'Test 10: Missing environment variable disables access',
        passed,
        `Status ${res.status}, disabled=${check.disabled}`
      );
    }

    // -------------------------------------------------------------------------
    // Test 11: Normal student login continues working
    // -------------------------------------------------------------------------
    {
      const res = await fetch(`${baseUrl}/api/auth/student/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'ishita.singh@student.eva-demo.test',
          password: 'Student@2026'
        })
      });
      const body = await res.json();
      const passed = res.status === 200 &&
                     body.success === true &&
                     body.user?.role === 'STUDENT' &&
                     typeof body.token === 'string';
      recordTest(
        'Test 11: Normal student authentication',
        passed,
        `Status ${res.status}, logged in as ${body.user?.fullName} (${body.user?.email})`
      );
    }

    // -------------------------------------------------------------------------
    // Test 12: Normal non-demo coordinator login works WITHOUT demo token
    // -------------------------------------------------------------------------
    {
      const { hashPassword } = await import('./src/utils/security.js');
      const testCoordId = 'COO_TEST_NORMAL';
      const testEmail = 'coordinator.official@thapar.edu';
      const testPass = 'NormalCoord@2026';

      query.run(`
        INSERT INTO users (
          user_id, full_name, email, password_hash, role, club_id,
          department, year_of_study, is_active, is_verified, must_change_password
        ) VALUES (?, ?, ?, ?, 'COORDINATOR', 'CLB001', 'Computer Engineering', 3, 1, 1, 0)
      `, [testCoordId, 'Official Coordinator', testEmail, hashPassword(testPass)]);

      // Login WITHOUT any demoAccessToken
      const res = await fetch(`${baseUrl}/api/auth/coordinator/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coordinatorId: testCoordId,
          password: testPass
        })
      });
      const body = await res.json();

      // Clean up test coordinator
      query.run('DELETE FROM users WHERE user_id = ?', [testCoordId]);

      const passed = res.status === 200 &&
                     body.success === true &&
                     body.user?.userId === testCoordId &&
                     typeof body.token === 'string';
      recordTest(
        'Test 12: Normal non-demo coordinator authentication without demo token',
        passed,
        `Status ${res.status}, authenticated as ${body.user?.fullName} without demo authorization`
      );
    }

    // -------------------------------------------------------------------------
    // Test 13: Existing database records remain unchanged
    // -------------------------------------------------------------------------
    {
      const userCount = query.get('SELECT COUNT(*) as count FROM users');
      const eventCount = query.get('SELECT COUNT(*) as count FROM events');
      const clubCount = query.get('SELECT COUNT(*) as count FROM clubs');
      const venueCount = query.get('SELECT COUNT(*) as count FROM venues');

      const passed = userCount.count >= 18 &&
                     eventCount.count >= 10 &&
                     clubCount.count === 6 &&
                     venueCount.count === 8;
      recordTest(
        'Test 13: Database preservation verification',
        passed,
        `Users=${userCount.count}, Events=${eventCount.count}, Clubs=${clubCount.count}, Venues=${venueCount.count}`
      );
    }

  } finally {
    await stopServer();
  }

  console.log('\n====================================================');
  const allPassed = results.every(r => r.passed);
  console.log(`Test Summary: ${results.filter(r => r.passed).length}/${results.length} PASSED`);
  console.log('====================================================');

  if (!allPassed) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
