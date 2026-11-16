import { apiRequest, withTestSql } from "./test-helpers";

// Test user credentials
export const TEST_USER = {
  email: "test@school-mis.com",
  password: "TestPassword123!",
  name: "Test User",
  role: "school_admin",
};

// Test authentication token (mock for testing)
export const TEST_AUTH_TOKEN = "test-auth-token-for-integration-tests";

/**
 * Helper to make authenticated API requests in tests
 */
export async function apiRequestWithAuth(
  path: string,
  init?: RequestInit,
  token: string = TEST_AUTH_TOKEN,
): Promise<Response> {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...init?.headers,
  };

  return apiRequest(path, {
    ...init,
    headers,
  });
}

/**
 * Setup test user in database
 */
export async function setupTestUser() {
  await withTestSql(async (sql) => {
    // Check if test user exists
    const existingUser = await sql.unsafe(
      `SELECT id FROM users WHERE email = '${TEST_USER.email}'`,
    );

    if (existingUser.length === 0) {
      // Create test user
      await sql.unsafe(`
        INSERT INTO users (
          id, email, name, password, role, email_verified, is_active, created_at, updated_at
        ) VALUES (
          gen_random_uuid(),
          '${TEST_USER.email}',
          '${TEST_USER.name}',
          '$2b$10$testhashedpassword',
          '${TEST_USER.role}',
          true,
          true,
          NOW(),
          NOW()
        )
      `);
    }
  });
}

/**
 * Cleanup test data after tests
 */
export async function cleanupTestData() {
  await withTestSql(async (sql) => {
    // Delete test-specific data
    await sql.unsafe(
      `DELETE FROM audit_logs WHERE email = '${TEST_USER.email}'`,
    );
  });
}

/**
 * Mock authentication middleware for tests
 */
export function mockAuthHeaders() {
  return {
    Authorization: `Bearer ${TEST_AUTH_TOKEN}`,
    "X-Test-User": TEST_USER.email,
  };
}
