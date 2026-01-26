# Package Issues Report

## Critical Issues

### 1. Version Mismatches

#### Zod Version Mismatch
- **@school/web**: `zod: ^4.3.5`
- **@school/api**: `zod: ^4.1.13`
- **@school/env**: `zod: ^4.1.13`
- **Impact**: Potential runtime incompatibilities and type errors
- **Fix**: Align all packages to use the same zod version (recommend `^4.3.5`)

#### Drizzle-ORM Version Mismatch
- **@school/web**: `drizzle-orm: ^0.45.1`
- **@school/storage**: `drizzle-orm: ^0.45.1`
- **@school/api**: `drizzle-orm: ^0.45.0`
- **Impact**: Potential database schema incompatibilities
- **Fix**: Update `@school/api` to use `^0.45.1`

#### Jose Version Mismatch
- **@school/web**: `jose: ^6.1.3` (in dependencies)
- **@school/storage**: `jose: ^5.9.0` (in devDependencies)
- **Impact**: Different JWT handling versions, potential security issues
- **Fix**: Align versions (recommend `^6.1.3` in storage dependencies if used)

### 2. Missing Dependencies

#### Vitest Missing
- **File**: `apps/web/src/lib/csv.test.ts` imports `vitest`
- **Issue**: `vitest` is not listed in `apps/web/package.json` devDependencies
- **Impact**: Tests cannot run, TypeScript errors
- **Fix**: Add `vitest` to `apps/web/package.json` devDependencies

### 3. TypeScript Configuration Issues

#### API Missing tsconfig.json
- **Issue**: `apps/api` doesn't have its own `tsconfig.json`
- **Impact**: TypeScript checking may include unintended files (web files), causing false errors
- **Fix**: Create `apps/api/tsconfig.json` with proper includes/excludes

#### Type Errors in API Typecheck
- Multiple errors from API trying to typecheck web files
- Missing type declarations for `bun:test`
- Datadog type issues
- **Fix**: Create proper tsconfig.json for API to exclude web files

## Recommended Fixes

### Priority 1 (Critical)
1. Align zod versions across all packages
2. Align drizzle-orm versions across all packages
3. Add vitest to web devDependencies
4. Create tsconfig.json for API package

### Priority 2 (Important)
1. Align jose versions
2. Fix TypeScript configuration to prevent cross-package type checking

## Fixed Issues ✅

1. ✅ **Zod versions aligned** - Updated `@school/api` and `@school/env` to use `zod: ^4.3.5`
2. ✅ **Drizzle-ORM versions aligned** - Updated `@school/api` to use `drizzle-orm: ^0.45.1`
3. ✅ **Vitest added** - Added `vitest: ^2.1.8` to `@school/web` devDependencies
4. ✅ **API tsconfig.json created** - Created proper TypeScript configuration for API package
5. ✅ **Storage import paths fixed** - Updated imports in `auth.service.ts` and `sms.service.ts` to use `@school/storage` instead of direct paths
6. ✅ **Table components added** - Added missing Table, TableBody, TableCell, TableHead, TableHeader, TableRow components to `ui/table.tsx`
7. ✅ **Select components created** - Added `@radix-ui/react-select` package and created proper Select components (SelectContent, SelectItem, SelectTrigger, SelectValue)

## Remaining Issues (Low Priority)

### Jose Version
- **@school/web**: `jose: ^6.1.3` (in dependencies)
- **@school/storage**: `jose: ^5.9.0` (in devDependencies)
- **Note**: Storage has jose in devDependencies only, likely for type checking. If not used, can be removed.

## Next Steps

Run the following to install updated dependencies:

```bash
bun install
```

This will install:
- Updated zod and drizzle-orm versions
- Vitest for testing
- @radix-ui/react-select for Select components

After installation, most TypeScript errors related to missing packages should be resolved.
