# FEE - Architecture Review & Feature-Driven Migration
## Enterprise-Grade Architecture Refactoring

---

## EXECUTIVE SUMMARY

This document outlines the complete architecture review and migration from a layered architecture to a **Feature-Driven Architecture**. This change improves code ownership, modularity, scalability, and maintainability.

**Migration Type**: Architecture refactoring (no UI/business logic changes)
**Impact**: Folder structure only (no code changes required)
**Benefit**: Better organization, easier onboarding, faster development

---

## CURRENT ARCHITECTURE (Layered)

### Problems with Current Structure

```
src/
├── app/                    ✅ Good (Next.js routing)
├── components/             ❌ Mixed concerns
│   ├── ui/                 ❌ UI components mixed with features
│   ├── features/           ❌ Feature components scattered
│   ├── layouts/            ❌ Layouts separate from features
│   └── providers/          ❌ Providers separate from features
├── hooks/                  ❌ Global hooks (hard to find)
├── lib/                    ❌ Mixed utilities
│   ├── supabase/           ❌ Should be in shared/services
│   ├── utils/              ❌ Should be in shared/utils
│   └── constants/          ❌ Should be in shared/constants
├── stores/                 ❌ Global state (hard to scale)
├── types/                  ❌ Global types (hard to find)
├── styles/                 ✅ Good (global styles)
├── assets/                 ✅ Good (global assets)
├── locales/                ✅ Good (i18n)
└── config/                 ✅ Good (global config)
```

**Issues**:
1. **Feature code scattered**: Auth code in `components/features/auth/`, `hooks/use-auth.ts`, `stores/auth-store.ts`
2. **Hard to find code**: No clear ownership, developers search everywhere
3. **Hard to delete features**: Can't delete a feature without touching multiple folders
4. **Hard to test**: Feature code spread across multiple directories
5. **Hard to scale**: Adding new features increases complexity everywhere

---

## NEW ARCHITECTURE (Feature-Driven)

### Principles

**1. Feature Isolation**
- Each feature is self-contained
- Feature code lives in one place
- Easy to find, easy to delete, easy to test

**2. Shared Code**
- Only truly reusable code in `shared/`
- UI components, utilities, hooks used by multiple features
- Clear separation: feature-specific vs. shared

**3. Code Ownership**
- Each feature has its own folder
- Clear responsibility boundaries
- Easy to assign ownership

**4. Scalability**
- Add new features without touching existing code
- Features can be developed in parallel
- Easy to onboard new developers

---

## NEW FOLDER STRUCTURE

```
src/
├── app/                                    # Next.js App Router (routing only)
│   ├── (auth)/                             # Auth routes
│   │   ├── login/
│   │   └── layout.tsx
│   ├── (main)/                             # Main app routes
│   │   ├── (tabs)/
│   │   │   ├── home/
│   │   │   ├── earn/
│   │   │   ├── wallet/
│   │   │   ├── profile/
│   │   │   └── stats/
│   │   └── layout.tsx
│   ├── layout.tsx                          # Root layout
│   └── page.tsx                            # Root page (redirect)
│
├── features/                               # Feature modules (PRIMARY)
│   ├── auth/                               # Authentication feature
│   │   ├── components/                     # Auth-specific components
│   │   │   ├── login-form.tsx
│   │   │   └── telegram-button.tsx
│   │   ├── hooks/                          # Auth-specific hooks
│   │   │   └── use-auth.ts
│   │   ├── types/                          # Auth-specific types
│   │   │   └── index.ts
│   │   ├── services/                       # Auth-specific services
│   │   │   └── auth.service.ts
│   │   ├── utils/                          # Auth-specific utilities
│   │   │   └── validation.ts
│   │   └── constants/                      # Auth-specific constants
│   │       └── config.ts
│   │
│   ├── wallet/                             # Wallet feature
│   │   ├── components/
│   │   │   ├── balance-card.tsx
│   │   │   ├── withdrawal-form.tsx
│   │   │   └── transaction-list.tsx
│   │   ├── hooks/
│   │   │   └── use-wallet.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── wallet.service.ts
│   │   ├── utils/
│   │   │   └── calculations.ts
│   │   └── constants/
│   │       └── config.ts
│   │
│   ├── earn/                               # Earn feature (main hub)
│   │   ├── components/
│   │   │   ├── earn-grid.tsx
│   │   │   └── quick-actions.tsx
│   │   ├── hooks/
│   │   │   └── use-earn.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── earn.service.ts
│   │   ├── utils/
│   │   │   └── helpers.ts
│   │   └── constants/
│   │       └── config.ts
│   │
│   ├── tasks/                              # Tasks feature
│   │   ├── components/
│   │   │   ├── task-list.tsx
│   │   │   ├── task-card.tsx
│   │   │   └── task-completion.tsx
│   │   ├── hooks/
│   │   │   └── use-tasks.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── tasks.service.ts
│   │   ├── utils/
│   │   │   └── validation.ts
│   │   └── constants/
│   │       └── config.ts
│   │
│   ├── missions/                           # Missions feature
│   │   ├── components/
│   │   │   ├── mission-list.tsx
│   │   │   ├── mission-card.tsx
│   │   │   └── mission-progress.tsx
│   │   ├── hooks/
│   │   │   └── use-missions.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── missions.service.ts
│   │   ├── utils/
│   │   │   └── progress.ts
│   │   └── constants/
│   │       └── config.ts
│   │
│   ├── referral/                           # Referral feature
│   │   ├── components/
│   │   │   ├── referral-card.tsx
│   │   │   ├── referral-link.tsx
│   │   │   └── referral-list.tsx
│   │   ├── hooks/
│   │   │   └── use-referral.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── referral.service.ts
│   │   ├── utils/
│   │   │   └── tracking.ts
│   │   └── constants/
│   │       └── config.ts
│   │
│   ├── notifications/                      # Notifications feature
│   │   ├── components/
│   │   │   ├── notification-list.tsx
│   │   │   └── notification-item.tsx
│   │   ├── hooks/
│   │   │   └── use-notifications.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── notifications.service.ts
│   │   ├── utils/
│   │   │   └── helpers.ts
│   │   └── constants/
│   │       └── config.ts
│   │
│   ├── profile/                            # Profile feature
│   │   ├── components/
│   │   │   ├── profile-header.tsx
│   │   │   ├── profile-stats.tsx
│   │   │   └── profile-settings.tsx
│   │   ├── hooks/
│   │   │   └── use-profile.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── profile.service.ts
│   │   ├── utils/
│   │   │   └── helpers.ts
│   │   └── constants/
│   │       └── config.ts
│   │
│   ├── settings/                           # Settings feature
│   │   ├── components/
│   │   │   ├── settings-form.tsx
│   │   │   └── settings-item.tsx
│   │   ├── hooks/
│   │   │   └── use-settings.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── settings.service.ts
│   │   ├── utils/
│   │   │   └── helpers.ts
│   │   └── constants/
│   │       └── config.ts
│   │
│   ├── support/                            # Support feature
│   │   ├── components/
│   │   │   ├── ticket-form.tsx
│   │   │   ├── ticket-list.tsx
│   │   │   └── ticket-detail.tsx
│   │   ├── hooks/
│   │   │   └── use-support.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── support.service.ts
│   │   ├── utils/
│   │   │   └── helpers.ts
│   │   └── constants/
│   │       └── config.ts
│   │
│   ├── admin/                              # Admin feature
│   │   ├── components/
│   │   │   ├── admin-dashboard.tsx
│   │   │   ├── user-management.tsx
│   │   │   └── task-management.tsx
│   │   ├── hooks/
│   │   │   └── use-admin.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── admin.service.ts
│   │   ├── utils/
│   │   │   └── helpers.ts
│   │   └── constants/
│   │       └── config.ts
│   │
│   └── leaderboard/                        # Leaderboard feature
│       ├── components/
│       │   ├── leaderboard-list.tsx
│       │   └── leaderboard-card.tsx
│       ├── hooks/
│       │   └── use-leaderboard.ts
│       ├── types/
│       │   └── index.ts
│       ├── services/
│       │   └── leaderboard.service.ts
│       ├── utils/
│       │   └── calculations.ts
│       └── constants/
│           └── config.ts
│
├── shared/                                 # Shared/reusable code
│   ├── components/                         # Reusable UI components
│   │   ├── ui/
│   │   │   ├── button/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── button.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── card/
│   │   │   │   ├── card.tsx
│   │   │   │   ├── card.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── input/
│   │   │   │   ├── input.tsx
│   │   │   │   ├── input.test.tsx
│   │   │   │   └── index.ts
│   │   │   └── ...
│   │   └── layouts/
│   │       ├── app-layout.tsx
│   │       ├── auth-layout.tsx
│   │       └── index.ts
│   │
│   ├── hooks/                              # Global hooks (used by multiple features)
│   │   ├── use-media-query.ts
│   │   ├── use-local-storage.ts
│   │   └── use-debounce.ts
│   │
│   ├── utils/                              # Global utilities
│   │   ├── cn.ts                           # Class name utility
│   │   ├── format.ts                       # Formatting utilities
│   │   ├── validation.ts                   # Validation utilities
│   │   └── helpers.ts                      # Helper functions
│   │
│   ├── constants/                          # Global constants
│   │   ├── routes.ts
│   │   ├── config.ts
│   │   └── enums.ts
│   │
│   ├── types/                              # Global types
│   │   ├── auth.ts
│   │   ├── wallet.ts
│   │   ├── tasks.ts
│   │   └── supabase.ts
│   │
│   └── services/                           # Global services
│       ├── supabase/
│       │   └── client.ts
│       ├── api/
│       │   └── client.ts
│       └── analytics/
│           └── client.ts
│
├── stores/                                 # Global state (Zustand)
│   ├── auth-store.ts
│   ├── wallet-store.ts
│   └── ui-store.ts
│
├── design-tokens/                          # Global design system
│   ├── color/
│   ├── typography/
│   ├── spacing/
│   ├── border/
│   ├── shadow/
│   ├── glass/
│   ├── animation/
│   ├── layout/
│   └── component/
│
├── styles/                                 # Global styles
│   ├── design-tokens.css
│   └── globals.css
│
├── assets/                                 # Global assets
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── locales/                                # i18n translations
│   ├── en/
│   └── es/
│
└── config/                                 # Global configuration
    ├── site.ts
    └── supabase.ts
```

---

## MIGRATION MAPPING

### Current → New Structure

| Current Location | New Location | Reason |
|------------------|--------------|--------|
| `src/components/features/auth/*` | `src/features/auth/components/*` | Feature isolation |
| `src/components/features/wallet/*` | `src/features/wallet/components/*` | Feature isolation |
| `src/components/features/tasks/*` | `src/features/tasks/components/*` | Feature isolation |
| `src/hooks/use-auth.ts` | `src/features/auth/hooks/use-auth.ts` | Feature ownership |
| `src/hooks/use-wallet.ts` | `src/features/wallet/hooks/use-wallet.ts` | Feature ownership |
| `src/stores/auth-store.ts` | `src/features/auth/stores/auth-store.ts` | Feature ownership |
| `src/stores/wallet-store.ts` | `src/features/wallet/stores/wallet-store.ts` | Feature ownership |
| `src/types/auth.ts` | `src/features/auth/types/index.ts` | Feature ownership |
| `src/types/wallet.ts` | `src/features/wallet/types/index.ts` | Feature ownership |
| `src/components/ui/button.tsx` | `src/shared/components/ui/button/button.tsx` | Shared UI |
| `src/components/ui/card.tsx` | `src/shared/components/ui/card/card.tsx` | Shared UI |
| `src/components/layouts/app-layout.tsx` | `src/shared/components/layouts/app-layout.tsx` | Shared layout |
| `src/lib/utils/cn.ts` | `src/shared/utils/cn.ts` | Shared utility |
| `src/lib/utils/format.ts` | `src/shared/utils/format.ts` | Shared utility |
| `src/lib/constants/routes.ts` | `src/shared/constants/routes.ts` | Shared constant |
| `src/lib/supabase/client.ts` | `src/shared/services/supabase/client.ts` | Shared service |
| `src/design-tokens/*` | `src/design-tokens/*` | Keep as is (global) |
| `src/styles/*` | `src/styles/*` | Keep as is (global) |
| `src/assets/*` | `src/assets/*` | Keep as is (global) |
| `src/locales/*` | `src/locales/*` | Keep as is (global) |

---

## FEATURE STRUCTURE

### Standard Feature Template

Each feature follows this structure:

```
features/
└── [feature-name]/
    ├── components/          # Feature-specific UI components
    │   ├── [component-name].tsx
    │   └── index.ts
    ├── hooks/               # Feature-specific React hooks
    │   ├── use-[feature].ts
    │   └── index.ts
    ├── types/               # Feature-specific TypeScript types
    │   ├── index.ts
    │   └── [type-name].ts
    ├── services/            # Feature-specific business logic
    │   ├── [feature].service.ts
    │   └── index.ts
    ├── utils/               # Feature-specific utilities
    │   ├── [utility].ts
    │   └── index.ts
    ├── constants/           # Feature-specific constants
    │   ├── config.ts
    │   └── index.ts
    └── index.ts             # Feature public API
```

### Feature Public API

Each feature exports only what's needed:

```typescript
// features/auth/index.ts
export { LoginForm } from './components/login-form'
export { TelegramButton } from './components/telegram-button'
export { useAuth } from './hooks/use-auth'
export { authService } from './services/auth.service'
export type { User, LoginCredentials } from './types'
```

---

## SHARED STRUCTURE

### What Goes in `shared/`

**UI Components** (used by multiple features):
- Button, Card, Input, Modal, etc.
- Layout components (AppLayout, AuthLayout)
- Navigation components

**Hooks** (used by multiple features):
- useMediaQuery
- useLocalStorage
- useDebounce

**Utils** (used by multiple features):
- cn (class name utility)
- format (currency, date, time)
- validation (common validation)

**Constants** (used by multiple features):
- routes
- config
- enums

**Types** (used by multiple features):
- Common interfaces
- Shared type definitions

**Services** (used by multiple features):
- Supabase client
- API client
- Analytics client

---

## WHAT DOESN'T CHANGE

### Global Code (Stays in Place)

- `src/design-tokens/` - Design system (global)
- `src/styles/` - Global styles (global)
- `src/assets/` - Static assets (global)
- `src/locales/` - i18n translations (global)
- `src/config/` - Configuration (global)
- `src/app/` - Next.js routing (framework-specific)

### Global State (Stays in Place)

- `src/stores/` - Zustand stores (global state management)

**Rationale**: Global state is already well-organized and feature-agnostic.

---

## BENEFITS OF NEW ARCHITECTURE

### 1. Code Ownership
- Each feature has a clear owner
- Easy to assign responsibility
- Clear boundaries

### 2. Modularity
- Features are self-contained
- Easy to understand
- Easy to test

### 3. Scalability
- Add new features without touching existing code
- Features can be developed in parallel
- Easy to onboard new developers

### 4. Maintainability
- Easy to find code
- Easy to delete features
- Easy to refactor

### 5. Testability
- Feature code in one place
- Easy to write unit tests
- Easy to write integration tests

### 6. Performance
- Tree-shaking per feature
- Code splitting per feature
- Lazy loading per feature

---

## MIGRATION STRATEGY

### Phase 1: Create New Structure (No Code Changes)
1. Create `features/` folder structure
2. Create `shared/` folder structure
3. Document migration plan

### Phase 2: Migrate Features (One by One)
1. Start with least critical feature (e.g., leaderboard)
2. Move feature code to new location
3. Update imports
4. Test thoroughly
5. Repeat for each feature

### Phase 3: Migrate Shared Code
1. Move UI components to `shared/components/ui/`
2. Move utilities to `shared/utils/`
3. Move constants to `shared/constants/`
4. Update imports

### Phase 4: Cleanup
1. Remove old folders (`components/`, `hooks/`, `lib/`, `types/`)
2. Update documentation
3. Train team

---

## EXAMPLE: Auth Feature Migration

### Before (Current)
```
src/
├── components/
│   └── features/
│       └── auth/
│           ├── login-form.tsx
│           └── telegram-button.tsx
├── hooks/
│   └── use-auth.ts
├── stores/
│   └── auth-store.ts
└── types/
    └── auth.ts
```

### After (New)
```
src/
└── features/
    └── auth/
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

---

## EXAMPLE: Shared UI Component Migration

### Before (Current)
```
src/
└── components/
    └── ui/
        ├── button.tsx
        ├── card.tsx
        └── input.tsx
```

### After (New)
```
src/
└── shared/
    └── components/
        └── ui/
            ├── button/
            │   ├── button.tsx
            │   ├── button.test.tsx
            │   └── index.ts
            ├── card/
            │   ├── card.tsx
            │   ├── card.test.tsx
            │   └── index.ts
            └── input/
                ├── input.tsx
                ├── input.test.tsx
                └── index.ts
```

---

## CODE EXAMPLES

### Feature Component

```typescript
// features/auth/components/login-form.tsx
import { useAuth } from '../hooks/use-auth'
import { Button } from '@/shared/components/ui/button'

export function LoginForm() {
  const { login, isLoading } = useAuth()

  return (
    <form onSubmit={login}>
      {/* Form content */}
      <Button type="submit" isLoading={isLoading}>
        Login with Telegram
      </Button>
    </form>
  )
}
```

### Feature Hook

```typescript
// features/auth/hooks/use-auth.ts
import { useAuthStore } from '../stores/auth-store'
import { authService } from '../services/auth.service'

export function useAuth() {
  const { user, setUser, logout } = useAuthStore()

  const login = async (credentials: LoginCredentials) => {
    const user = await authService.login(credentials)
    setUser(user)
  }

  return { user, login, logout }
}
```

### Feature Service

```typescript
// features/auth/services/auth.service.ts
import { supabase } from '@/shared/services/supabase/client'

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword(credentials)
    if (error) throw error
    return data.user
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },
}
```

---

## CONCLUSION

This architecture review recommends migrating from a **Layered Architecture** to a **Feature-Driven Architecture**. This change:

✅ Improves code ownership
✅ Improves modularity
✅ Improves scalability
✅ Improves maintainability
✅ Improves testability
✅ Makes onboarding easier
✅ Makes development faster

**Next Steps**:
1. Review this document with the team
2. Approve migration plan
3. Execute Phase 1 (create new structure)
4. Execute Phase 2-4 (migrate code)
5. Update documentation
6. Train team

**Status**: Architecture Review COMPLETE
**Next Phase**: Implementation (if approved)

---

*Architecture Review V1*
*Created: 2026-07-18*
*Status: READY FOR REVIEW*