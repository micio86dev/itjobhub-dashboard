# Testing Strategy

## Overview

Dashboard unit tests created for Phase 6:

- ✅ **Services**: `jobs.service.spec.ts`
- ✅ **Stores**: `auth.store.spec.ts`
- ⚠️ **Composables**: `useTheme.spec.ts` (skipped - see below)
- ⚠️ **Components**: `StatCard`, `DataTable`, `JobsMap` (skipped - see below)

## Current Limitations

### Known Issue: reka-ui + @vue/test-utils WeakMap Bug

**Status**: Component and composable rendering tests are currently blocked due to a known compatibility issue between `reka-ui` (shadcn-vue's foundation) and `@vue/test-utils`.

**Error**: `WeakMap keys must be objects or non-registered symbols`  
**Location**: `@vue/test-utils/dist/vue-test-utils.cjs.js` line 1359  
**Trigger**: When VTU attempts to stub or register components that use reka-ui primitives (CheckboxRoot, CheckboxIndicator, Primitive wrappers, etc.), the internal WeakMap registration fails.

**Affected Tests**:

- All component tests (`StatCard`, `DataTable`, `JobsMap`)
- Composable tests that use components (`useTheme`)

**Attempted Fixes**:

1. ❌ Custom stub configuration in test-setup.ts
2. ❌ Per-test `global.stubs` overrides
3. ❌ `vi.mock` for reka-ui module
4. ❌ Disabling VTU global config stubs
5. ❌ Shallow mounting

**Root Cause**: reka-ui primitives are functional wrapper components that rely on Symbol/WeakMap internals incompatible with VTU's stub registration mechanism in the current stable release (@vue/test-utils v2.4.6).

**Workaround**: Services, stores, and pure composables (no component deps) are tested successfully. Component tests use `.todo()` placeholders until VTU or reka-ui updates resolve the issue.

**Recommendations**:

- Monitor [@vue/test-utils](https://github.com/vuejs/test-utils) for compatibility patches
- Consider integration/E2E tests (Playwright) for UI validation
- Upgrade to future VTU v2.5+ if/when reka-ui support is added

## Test Execution

Run unit tests:

```bash
bun run test:unit
```

Run tests with coverage:

```bash
bun run test:unit -- --coverage
```

Run E2E tests (stubbed):

```bash
bun run test:e2e
```

## Test Best Practices

1. ✅ **No `vi.mock`**: Use spies on real modules instead
2. ✅ **No global MSW**: Set up request handlers per test
3. ✅ **Use `createTestingPinia`**: For Pinia store tests
4. ✅ **Real `js-cookie`**: No cookie mocking
5. ⚠️ **Component tests**: Pending VTU reka-ui fix

## Passing Tests Summary

### jobs.service.spec.ts

- `getJobs` calls correct endpoint with params
- `getJobsWithLocation` filters jobs with GPS coordinates
- `getTopSkills` returns array sorted by count (descending)

### auth.store.spec.ts

- `login` sets token and user on successful response
- `logout` clears state and navigates to login
- `fetchMe` loads user profile on mount

## Next Steps

1. Implement remaining unit tests for:
   - `TopList.vue`
   - Other services (users, companies, news, analytics)
   - Pages (integration-style tests if component rendering becomes available)
2. Complete E2E tests with Playwright
3. Add coverage reporting and thresholds
4. Monitor for VTU updates and restore component tests
