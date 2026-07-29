# FEE - Migration Guide
## From Layered to Feature-Driven Architecture

---

## MIGRATION OVERVIEW

This guide provides step-by-step instructions for migrating from the current layered architecture to the new feature-driven architecture.

**Migration Type**: Folder structure only (no business logic changes)
**Estimated Time**: 2-3 days for complete migration
**Risk Level**: Low (no functionality changes, only reorganization)

---

## PHASE 1: PREPARATION (Day 1)

### Step 1.1: Backup Current Code

```bash
# Create a backup branch
git checkout -b backup/pre-migration
git push origin backup/pre-migration

# Return to main branch
git checkout main
```

### Step 1.2: Install Dependencies

```bash
# Install all dependencies
npm install

# Verify installation
npm run type-check
```

### Step 1.3: Create New Folder Structure

```bash
# Create features directory
mkdir -p src/features/{auth,wallet,earn,tasks,missions,referral,notifications,profile,settings,support,admin,leaderboard}

# Create shared directory
mkdir -p src/shared/{components/ui,components/layouts,hooks,utils,constants,types,services}

# Create stores directory (if not exists)
mkdir -p src/stores

# Create config directory (if not exists)
mkdir -p src/config
```

### Step 1.4: Verify TypeScript Configuration

```bash
# Check TypeScript configuration
npm run type-check

# Should show errors about missing files (expected)
```

---

## PHASE 2: MIGRATE SHARED CODE (Day 1-2)

### Step 2.1: Migrate Utilities

**Move files**:
```bash
# From
src/lib/utils/cn.ts
src/lib/utils/format.ts

# To
src/shared/utils/cn.ts
src/shared/utils/format.ts
```

**Update imports** (will be done in Phase 4)

### Step 2.2: Migrate Constants

**Move files**:
```bash
# From
src/lib/constants/routes.ts
src/lib/constants/config.ts

# To
src/shared/constants/routes.ts
src/shared/constants/config.ts
```

### Step 2.3: Migrate Services

**Move files**:
```bash
# From
src/lib/supabase/client.ts

# To
src/shared/services/supabase/client.ts
```

### Step 2.4: Migrate Types

**Move files**:
```bash
# From
src/types/supabase.ts

# To
src/shared/types/supabase.ts
# Also keep at src/types/supabase.ts for backward compatibility
```

### Step 2.5: Migrate Hooks

**Move files**:
```bash
# From (if exists)
src/hooks/use-auth.ts
src/hooks/use-wallet.ts

# To
src/shared/hooks/use-auth.ts
src/shared/hooks/use-wallet.ts
```

**Note**: Only move hooks that are used by multiple features. Feature-specific hooks stay in their feature folder.

### Step 2.6: Migrate UI Components

**Move files**:
```bash
# From
src/components/ui/button.tsx
src/components/ui/card.tsx
src/components/ui/input.tsx

# To
src/shared/components/ui/button/button.tsx
src/shared/components/ui/card/card.tsx
src/shared/components/ui/input/input.tsx
```

**Create index.ts for each component**:
```typescript
// src/shared/components/ui/button/index.ts
export { Button } from './button'
```

### Step 2.7: Migrate Layouts

**Move files**:
```bash
# From
src/components/layouts/app-layout.tsx
src/components/layouts/auth-layout.tsx

# To
src/shared/components/layouts/app-layout.tsx
src/shared/components/layouts/auth-layout.tsx
```

---

## PHASE 3: MIGRATE FEATURES (Day 2-3)

### Migration Order (Least to Most Critical)

1. leaderboard
2. support
3. settings
4. notifications
5. missions
6. referral
7. tasks
8. profile
9. earn
10. wallet
11. auth (most critical - do last)

### Step 3.1: Migrate Auth Feature (Example)

**Current structure**:
```
src/components/features/auth/
├── login-form.tsx
└── telegram-button.tsx

src/hooks/use-auth.ts
src/stores/auth-store.ts
src/types/auth.ts
```

**New structure**:
```
src/features/auth/
├── components/
│   ├── login-form.tsx
│   ├── telegram-button.tsx
│   └── index.ts
├── hooks/
│   ├── use-auth.ts
│   └── index.ts
├── types/
│   ├── index.ts
│   └── auth.ts
├── services/
│   ├── auth.service.ts
│   └── index.ts
├── utils/
│   ├── validation.ts
│   └── index.ts
├── constants/
│   ├── config.ts
│   └── index.ts
└── index.ts
```

**Actions**:
1. Create new folder structure
2. Move files to new locations
3. Create index.ts files
4. Update internal imports
5. Test thoroughly

### Step 3.2: Migrate Remaining Features

Repeat Step 3.1 for each feature in order.

**For each feature**:
1. Create folder structure
2. Move files
3. Create index.ts
4. Update imports
5. Test

---

## PHASE 4: UPDATE IMPORTS (Day 3)

### Step 4.1: Update Feature Imports

**Before**:
```typescript
// ❌ OLD
import { useAuth } from '../../hooks/use-auth'
import { authService } from '../../services/auth.service'
import { Button } from '../ui/button'
import { formatCurrency } from '../../../lib/utils/format'
```

**After**:
```typescript
// ✅ NEW
import { useAuth } from '@/features/auth/hooks/use-auth'
import { authService } from '@/features/auth/services/auth.service'
import { Button } from '@/shared/components/ui/button'
import { formatCurrency } from '@/shared/utils/format'
```

### Step 4.2: Update All Import Statements

**Search and replace patterns**:

```bash
# Utilities
find src/features -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../../lib/utils/|from "@/shared/utils/|g'
find src/features -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../lib/utils/|from "@/shared/utils/|g'
find src/features -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../lib/utils/|from "@/shared/utils/|g'

# Constants
find src/features -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../../lib/constants/|from "@/shared/constants/|g'
find src/features -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../lib/constants/|from "@/shared/constants/|g'
find src/features -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../lib/constants/|from "@/shared/constants/|g'

# Services
find src/features -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../../lib/supabase/|from "@/shared/services/supabase/|g'
find src/features -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../lib/supabase/|from "@/shared/services/supabase/|g'
find src/features -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../lib/supabase/|from "@/shared/services/supabase/|g'

# UI Components
find src/features -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../../components/ui/|from "@/shared/components/ui/|g'
find src/features -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../components/ui/|from "@/shared/components/ui/|g'
find src/features -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../components/ui/|from "@/shared/components/ui/|g'
```

### Step 4.3: Update Shared Imports

**Update shared components to use new paths**:
```typescript
// Before
import { cn } from '@/lib/utils/cn'

// After
import { cn } from '@/shared/utils/cn'
```

### Step 4.4: Verify TypeScript

```bash
# Check for TypeScript errors
npm run type-check

# Fix any remaining import errors
```

---

## PHASE 5: TESTING (Day 3)

### Step 5.1: Run TypeScript Check

```bash
npm run type-check
```

**Expected**: No errors

### Step 5.2: Run Linter

```bash
npm run lint
```

**Expected**: No errors

### Step 5.3: Run Tests

```bash
npm test
```

**Expected**: All tests pass

### Step 5.4: Manual Testing

1. Start development server:
   ```bash
   npm run dev
   ```

2. Test each feature:
   - Auth: Login/logout flow
   - Wallet: View balance, transactions
   - Tasks: View and complete tasks
   - Profile: View and edit profile
   - Settings: Change settings
   - etc.

3. Verify all functionality works

---

## PHASE 6: CLEANUP (Day 3)

### Step 6.1: Remove Old Folders

**After thorough testing**:

```bash
# Remove old folders (keep as backup first)
mv src/components src/components-backup
mv src/hooks src/hooks-backup
mv src/lib src/lib-backup
mv src/types src/types-backup

# Test again to ensure everything works
npm run dev
```

**If everything works**:
```bash
# Remove backups
rm -rf src/components-backup
rm -rf src/hooks-backup
rm -rf src/lib-backup
rm -rf src/types-backup
```

### Step 6.2: Update Documentation

1. Update README.md with new folder structure
2. Update CONTRIBUTING.md with new guidelines
3. Update architecture diagrams
4. Update onboarding documentation

### Step 6.3: Train Team

1. Schedule team meeting
2. Present new architecture
3. Walk through folder structure
4. Explain import patterns
5. Answer questions

---

## ROLLBACK PLAN

### If Something Goes Wrong

```bash
# Rollback to backup branch
git checkout backup/pre-migration

# Or rollback last commit
git revert HEAD
```

### Partial Rollback

If only one feature has issues:
1. Revert only that feature
2. Keep other migrated features
3. Fix the issue
4. Re-migrate

---

## COMMON ISSUES AND SOLUTIONS

### Issue 1: Import Path Errors

**Symptom**: TypeScript cannot find modules

**Solution**:
```bash
# Verify tsconfig.json paths
# Restart TypeScript server in VS Code
# Run npm run type-check
```

### Issue 2: Circular Dependencies

**Symptom**: "Circular dependency" error

**Solution**:
- Move shared code to `shared/`
- Use dependency injection
- Refactor to avoid circular references

### Issue 3: Missing Exports

**Symptom**: "Module has no exported member"

**Solution**:
- Check feature index.ts files
- Ensure all exports are defined
- Verify export statements

### Issue 4: Test Failures

**Symptom**: Tests fail after migration

**Solution**:
- Update test imports
- Update test file paths
- Run tests after each feature migration

---

## SUCCESS CRITERIA

### Phase 1 Complete
- ✅ New folder structure created
- ✅ Dependencies installed
- ✅ TypeScript configured

### Phase 2 Complete
- ✅ Shared code migrated
- ✅ Shared imports updated
- ✅ No TypeScript errors

### Phase 3 Complete
- ✅ All features migrated
- ✅ Feature imports updated
- ✅ No TypeScript errors

### Phase 4 Complete
- ✅ All imports updated
- ✅ No TypeScript errors
- ✅ No lint errors

### Phase 5 Complete
- ✅ All tests pass
- ✅ Manual testing complete
- ✅ No regressions

### Phase 6 Complete
- ✅ Old folders removed
- ✅ Documentation updated
- ✅ Team trained

---

## TIMELINE

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Preparation | 4 hours | None |
| Phase 2: Shared Code | 8 hours | Phase 1 |
| Phase 3: Features | 16 hours | Phase 2 |
| Phase 4: Update Imports | 8 hours | Phase 3 |
| Phase 5: Testing | 8 hours | Phase 4 |
| Phase 6: Cleanup | 4 hours | Phase 5 |
| **Total** | **48 hours (6 days)** | - |

---

## CHECKLIST

### Pre-Migration
- [ ] Backup created
- [ ] Team notified
- [ ] Dependencies installed
- [ ] TypeScript configured

### Shared Code Migration
- [ ] Utilities migrated
- [ ] Constants migrated
- [ ] Services migrated
- [ ] Types migrated
- [ ] Hooks migrated
- [ ] UI components migrated
- [ ] Layouts migrated

### Feature Migration
- [ ] leaderboard migrated
- [ ] support migrated
- [ ] settings migrated
- [ ] notifications migrated
- [ ] missions migrated
- [ ] referral migrated
- [ ] tasks migrated
- [ ] profile migrated
- [ ] earn migrated
- [ ] wallet migrated
- [ ] auth migrated

### Import Updates
- [ ] Feature imports updated
- [ ] Shared imports updated
- [ ] TypeScript errors resolved
- [ ] Lint errors resolved

### Testing
- [ ] TypeScript check passes
- [ ] Lint passes
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing complete

### Cleanup
- [ ] Old folders removed
- [ ] Documentation updated
- [ ] Team trained
- [ ] Migration complete

---

## CONCLUSION

This migration guide provides a complete, step-by-step process for migrating from a layered architecture to a feature-driven architecture. Follow each phase carefully, test thoroughly, and don't hesitate to rollback if needed.

**Status**: Migration Guide COMPLETE
**Next Step**: Execute Phase 1
**Ready for**: Team execution

---

*Migration Guide V1*
*Created: 2026-07-18*
*Status: READY FOR EXECUTION*