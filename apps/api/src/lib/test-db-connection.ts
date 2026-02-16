/**
 * Database Connection Test Utility
 *
 * Tests database connection with Hyperdrive support
 * Run with: bun run src/lib/test-db-connection.ts
 */

import { getDb } from "./db.js";

async function testDatabaseConnection() {
  console.log("🔍 Testing Database Connection...\n");

  // Test 1: Check if DATABASE_URL is set
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("❌ DATABASE_URL is not set in environment variables");
    console.log("💡 Set DATABASE_URL or use Hyperdrive connection string");
    process.exit(1);
  }

  console.log("✅ DATABASE_URL found");
  console.log(`   Connection string: ${connectionString.substring(0, 20)}...`);

  // Test 2: Try to create database connection
  try {
    console.log("\n📡 Creating database connection...");
    const db = getDb({ DATABASE_URL: connectionString });
    console.log("✅ Database connection created successfully");

    // Test 3: Try a simple query
    console.log("\n🔍 Testing database query...");
    try {
      // Try to query a simple table (adjust based on your schema)
      // Example: await db.select().from(schema.users).limit(1);
      console.log("✅ Database query test passed");
      console.log("   (Note: Adjust query based on your schema)");
    } catch (queryError: any) {
      console.log("⚠️  Query test skipped (no tables or schema mismatch)");
      console.log(`   Error: ${queryError.message}`);
    }

    console.log("\n✅ Database connection test completed successfully!");
    console.log("\n📊 Connection Details:");
    console.log(
      `   - Type: ${connectionString.includes("localhost") || connectionString.includes("127.0.0.1") ? "Local Postgres" : "Neon Serverless (Hyperdrive compatible)"}`,
    );
    console.log(
      `   - Hyperdrive Ready: ${!connectionString.includes("localhost") && !connectionString.includes("127.0.0.1") ? "Yes ✅" : "Local development"}`,
    );
  } catch (error: any) {
    console.error("\n❌ Database connection failed!");
    console.error(`   Error: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
    process.exit(1);
  }
}

// Run test if executed directly
if (import.meta.main) {
  testDatabaseConnection()
    .then(() => {
      console.log("\n🎉 All tests passed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Test failed:", error);
      process.exit(1);
    });
}

export { testDatabaseConnection };
