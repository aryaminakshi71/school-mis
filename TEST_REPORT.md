# Test Report

## Unit Tests

$ bun run --filter '@school/api' test:unit
@school/api test:unit: bun test v1.3.5 (1e86cebd)
@school/api test:unit: 
@school/api test:unit: __tests__/unit/utils.test.ts:
@school/api test:unit: (pass) Utilities > should format currency correctly [13.41ms]
@school/api test:unit: (pass) Utilities > should format percentage correctly [0.36ms]
@school/api test:unit: (pass) Utilities > should truncate text correctly [0.13ms]
@school/api test:unit: (pass) Validators > should validate email correctly [0.09ms]
@school/api test:unit: (pass) Validators > should validate phone number correctly [0.21ms]
@school/api test:unit: (pass) Date Formatters > should format date for display [1.27ms]
@school/api test:unit: (pass) Date Formatters > should format date for input [0.17ms]
@school/api test:unit: 
@school/api test:unit: __tests__/unit/routers.test.ts:
@school/api test:unit: (pass) Health Check API - Unit Tests > should validate health response structure
@school/api test:unit: (pass) Health Check API - Unit Tests > should format timestamp correctly [0.48ms]
@school/api test:unit: (pass) Students Router - Unit Tests > should validate student input data [0.04ms]
@school/api test:unit: (pass) Students Router - Unit Tests > should reject empty firstName
@school/api test:unit: (pass) Students Router - Unit Tests > should validate pagination parameters [0.16ms]
@school/api test:unit: (pass) Classes Router - Unit Tests > should validate class structure
@school/api test:unit: (pass) Classes Router - Unit Tests > should validate session structure [0.07ms]
@school/api test:unit: (pass) Attendance Router - Unit Tests > should validate attendance status values [0.04ms]
@school/api test:unit: (pass) Attendance Router - Unit Tests > should validate attendance record structure [0.07ms]
@school/api test:unit: (pass) Fees Router - Unit Tests > should validate fee structure [0.02ms]
@school/api test:unit: (pass) Fees Router - Unit Tests > should validate payment structure [0.03ms]
@school/api test:unit: (pass) Validation Utilities > should validate UUID format
@school/api test:unit: (pass) Validation Utilities > should validate email format [0.09ms]
@school/api test:unit: (pass) Validation Utilities > should validate phone number format [0.18ms]
@school/api test:unit: (pass) Validation Utilities > should validate date format [0.02ms]
@school/api test:unit: (pass) Pagination Tests > should calculate offset correctly [0.04ms]
@school/api test:unit: (pass) Pagination Tests > should calculate total pages correctly [0.04ms]
@school/api test:unit: (pass) Router Configuration Tests > should have all required modules [0.15ms]
@school/api test:unit: 
@school/api test:unit: __tests__/unit/api.test.ts:
@school/api test:unit: (pass) API Health Endpoint > should return health status [3.37ms]
@school/api test:unit: (pass) Students Router > should return empty list of students [0.36ms]
@school/api test:unit: (pass) Attendance Router > should return attendance summary [0.39ms]
@school/api test:unit: 
@school/api test:unit:  28 pass
@school/api test:unit:  0 fail
@school/api test:unit:  100 expect() calls
@school/api test:unit: Ran 28 tests across 3 files. [53.00ms]
@school/api test:unit: Exited with code 0

## Integration Tests

$ bun run --filter '@school/api' test:integration
@school/api test:integration: bun test v1.3.5 (1e86cebd)
@school/api test:integration: 
@school/api test:integration: __tests__/integration/database.test.ts:
@school/api test:integration: (pass) Database Integration Tests > should connect to database (mock)
@school/api test:integration: (pass) Database Integration Tests > should fetch students (mock) [0.23ms]
@school/api test:integration: (pass) Database Integration Tests > should fetch teachers (mock) [0.05ms]
@school/api test:integration: (pass) API Integration Tests > should handle CORS headers [4.45ms]
@school/api test:integration: (pass) API Integration Tests > should handle rate limiting (mock) [0.96ms]
@school/api test:integration: 
@school/api test:integration:  5 pass
@school/api test:integration:  0 fail
@school/api test:integration:  9 expect() calls
@school/api test:integration: Ran 5 tests across 1 file. [28.00ms]
@school/api test:integration: Exited with code 0
