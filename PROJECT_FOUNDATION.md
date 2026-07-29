# FEE - Project Foundation
## Complete Production-Ready Engineering Foundation

---

## DOCUMENT PURPOSE

This document defines the **complete project foundation** for Fee. It establishes the folder structure, naming conventions, configuration, and architectural patterns that will be used throughout the project.

**This document is based on:**
- All previous architectural documents
- Next.js best practices
- Supabase best practices
- Enterprise-grade project structure

**This document is used by:**
- Software engineers (to understand project structure)
- DevOps engineers (to set up CI/CD)
- QA engineers (to understand test structure)
- New team members (to onboard quickly)

---

## TECH STACK

### Core Framework
- **Next.js**: Latest version with App Router
- **TypeScript**: Strict mode enabled
- **React**: Latest version

### Styling
- **Tailwind CSS**: Latest version
- **Framer Motion**: For animations (not implemented yet)

### Backend
- **Supabase**: Authentication, Database, Storage, Realtime, Edge Functions

### State Management
- **Zustand**: Lightweight state management

### Forms & Validation
- **React Hook Form**: Form handling
- **Zod**: Schema validation

### Utilities
- **Lucide React**: Icons
- **clsx**: Class name utility
- **tailwind-merge**: Tailwind class merging

---

## FOLDER STRUCTURE

```
fee-mini-app/
├── .github/                          # GitHub Actions CI/CD
│   └── workflows/
│       ├── ci.yml
│       ├── cd-staging.yml
│       └── cd-production.yml
│
├── .vscode/                          # VSCode settings
│   ├── extensions.json
│   └── settings.json
│
├── docs/                             # Documentation
│   ├── architecture/
│   ├── api/
│   └── guides/
│
├── public/                           # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── src/                              # Source code
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth routes (login, onboarding)
│   │   ├── (main)/                   # Main app routes (home, earn, profile)
│   │   ├── api/                      # API routes (if needed)
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Root page (redirect)
│   │   └── globals.css               # Global styles
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # Reusable UI components
│   │   │   ├── button/
│   │   │   ├── card/
│   │   │   ├── input/
│   │   │   └── ...
│   │   ├── features/                 # Feature-specific components
│   │   │   ├── auth/
│   │   │   ├── wallet/
│   │   │   ├── tasks/
│   │   │   └── ...
│   │   ├── layouts/                  # Layout components
│   │   │   ├── app-layout.tsx
│   │   │   ├── auth-layout.tsx
│   │   │   └── ...
│   │   └── providers/                # Context providers
│   │       ├── auth-provider.tsx
│   │       ├── theme-provider.tsx
│   │       └── ...
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-wallet.ts
│   │   └── ...
│   │
│   ├── lib/                          # Utilities and helpers
│   │   ├── supabase/                 # Supabase client and utilities
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   └── ...
│   │   ├── utils/                    # General utilities
│   │   │   ├── cn.ts
│   │   │   ├── format.ts
│   │   │   └── ...
│   │   └── constants/                # Constants
│   │       ├── routes.ts
│   │       ├── config.ts
│   │       └── ...
│   │
│   ├── stores/                       # Zustand stores
│   │   ├── auth-store.ts
│   │   ├── wallet-store.ts
│   │   └── ...
│   │
│   ├── types/                        # TypeScript types
│   │   ├── auth.ts
│   │   ├── wallet.ts
│   │   ├── tasks.ts
│   │   └── ...
│   │
│   ├── styles/                       # Global styles
│   │   ├── globals.css
│   │   └── tailwind.css
│   │
│   ├── assets/                       # Static assets
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icons/
│   │
│   ├── locales/                      # i18n translations
│   │   ├── en/
│   │   ├── es/
│   │   └── ...
│   │
│   └── config/                       # Configuration files
│       ├── site.ts
│       ├── supabase.ts
│       └── ...
│
├── .env.local                        # Local environment variables
├── .env.staging                      # Staging environment variables
├── .env.production                   # Production environment variables
├── .env.example                      # Example environment variables
│
├── .gitignore                        # Git ignore
├── .eslintrc.json                    # ESLint configuration
├── .prettierrc.json                  # Prettier configuration
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── postcss.config.js                 # PostCSS configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies
├── README.md                         # Project README
└── LICENSE                           # License file
```

---

## ARCHITECTURAL DECISIONS

### 1. Next.js App Router

**Decision**: Use Next.js App Router (not Pages Router)

**Rationale**:
- Modern React patterns (Server Components)
- Better performance (automatic code splitting)
- Better SEO (server-side rendering)
- Better developer experience (file-based routing)
- Future-proof (Next.js direction)

**Trade-offs**:
- Newer, less mature than Pages Router
- Some third-party libraries not yet compatible
- Learning curve for team

---

### 2. TypeScript Strict Mode

**Decision**: Enable TypeScript strict mode

**Rationale**:
- Catch errors at compile time
- Better IDE support (autocomplete, type checking)
- Self-documenting code
- Easier refactoring
- Industry standard

**Trade-offs**:
- More verbose code
- Longer compile times
- Steeper learning curve

---

### 3. Tailwind CSS

**Decision**: Use Tailwind CSS for styling

**Rationale**:
- Rapid UI development
- Consistent design system
- Small bundle size (purges unused styles)
- Easy maintenance
- Industry standard

**Trade-offs**:
- Learning curve for team
- HTML can become verbose
- Requires build configuration

---

### 4. Supabase

**Decision**: Use Supabase as backend platform

**Rationale**:
- Managed PostgreSQL (no database administration)
- Built-in authentication (Telegram OAuth)
- Built-in storage (file uploads)
- Built-in realtime (WebSocket)
- Built-in edge functions (serverless)
- Rapid development
- Cost-effective

**Trade-offs**:
- Vendor lock-in
- Limited customization
- Dependent on Supabase platform

---

### 5. Zustand

**Decision**: Use Zustand for state management

**Rationale**:
- Lightweight (1KB)
- Simple API
- No boilerplate
- TypeScript support
- DevTools support
- Better than Redux (less complex)

**Trade-offs**:
- Less mature than Redux
- Smaller ecosystem
- Less community support

---

### 6. React Hook Form + Zod

**Decision**: Use React Hook Form + Zod for forms

**Rationale**:
- React Hook Form: Performance (minimal re-renders)
- Zod: TypeScript-first schema validation
- Excellent DX (developer experience)
- Industry standard

**Trade-offs**:
- Learning curve
- Requires schema definition

---

## NAMING CONVENTIONS

### File Naming

**Components**:
- PascalCase: `Button.tsx`, `Card.tsx`, `WalletBalance.tsx`
- Index files: `index.tsx` (for component directories)

**Hooks**:
- camelCase with `use` prefix: `useAuth.ts`, `useWallet.ts`

**Utilities**:
- camelCase: `format.ts`, `cn.ts`, `validate.ts`

**Types**:
- PascalCase: `auth.ts`, `wallet.ts`, `tasks.ts`

**Constants**:
- UPPER_SNAKE_CASE: `ROUTES.ts`, `CONFIG.ts`

**Stores**:
- camelCase with `store` suffix: `auth-store.ts`, `wallet-store.ts`

### Code Naming

**Components**:
- PascalCase: `Button`, `Card`, `WalletBalance`

**Hooks**:
- camelCase with `use` prefix: `useAuth`, `useWallet`

**Functions**:
- camelCase: `formatCurrency`, `validateEmail`

**Variables**:
- camelCase: `userName`, `isLoading`

**Constants**:
- UPPER_SNAKE_CASE: `MAX_RETRIES`, `DEFAULT_TIMEOUT`

**Types/Interfaces**:
- PascalCase: `User`, `Wallet`, `Task`

**Enums**:
- PascalCase: `UserRole`, `TaskStatus`

---

## ABSOLUTE IMPORTS

### Configuration

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Usage**:
```typescript
// Instead of: import { Button } from '../../components/ui/button'
import { Button } from '@/components/ui/button'

// Instead of: import { useAuth } from '../../../hooks/use-auth'
import { useAuth } from '@/hooks/use-auth'

// Instead of: import { formatCurrency } from '../../../../lib/utils/format'
import { formatCurrency } from '@/lib/utils/format'
```

**Benefits**:
- Cleaner imports
- Easier refactoring
- No relative path hell
- Better IDE support

---

## ENVIRONMENT STRUCTURE

### Environment Files

**.env.example** (committed to git):
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Telegram
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_WEBHOOK_SECRET=xxx

# External Services
PAYEER_API_KEY=xxx
PAYEER_API_SECRET=xxx
SENDGRID_API_KEY=xxx
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
MIXPANEL_API_KEY=xxx

# Application
NODE_ENV=development
LOG_LEVEL=debug
CACHE_TTL=3600
RATE_LIMIT_MAX=100
```

**.env.local** (not committed):
```bash
# Local development
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**.env.staging** (not committed):
```bash
# Staging environment
NEXT_PUBLIC_SUPABASE_URL=https://xxx-staging.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**.env.production** (not committed):
```bash
# Production environment
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Environment Variable Rules

**Naming Convention**:
- `NEXT_PUBLIC_*`: Client-side accessible
- `SUPABASE_*`: Supabase configuration
- `TELEGRAM_*`: Telegram configuration
- `PAYEER_*`: Payeer configuration
- `SENDGRID_*`: SendGrid configuration
- `TWILIO_*`: Twilio configuration
- `MIXPANEL_*`: Mixpanel configuration

**Security**:
- Never commit `.env.local`, `.env.staging`, `.env.production`
- Commit `.env.example` with placeholder values
- Use Supabase secrets for sensitive values
- Rotate secrets regularly

---

## CONFIGURATION FILES

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // React strict mode
  reactStrictMode: true,

  // Image optimization
  images: {
    domains: ['localhost', 'xxx.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: false,
      },
    ]
  },

  // Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

### tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors (to be defined in design system)
      },
      fontFamily: {
        // Custom fonts (to be defined in design system)
      },
    },
  },
  plugins: [],
}

export default config
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### .eslintrc.json

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### .prettierrc.json

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

---

## PROVIDER ARCHITECTURE

### Provider Hierarchy

```typescript
// src/app/layout.tsx
import { AuthProvider } from '@/components/providers/auth-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { QueryProvider } from '@/components/providers/query-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
```

### Provider Responsibilities

**QueryProvider**:
- React Query configuration
- Cache configuration
- DevTools (development only)

**ThemeProvider**:
- Theme management (light/dark mode)
- Theme persistence (localStorage)
- Theme context

**AuthProvider**:
- Authentication state management
- User session management
- Token refresh

---

## THEME ARCHITECTURE

### Theme Structure

```typescript
// src/config/theme.ts
export const theme = {
  colors: {
    // Primary colors
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
    },
    // Neutral colors
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      500: '#737373',
      900: '#171717',
    },
    // Semantic colors
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  fonts: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['Fira Code', 'monospace'],
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
  },
  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
}
```

### Theme Usage

```typescript
// src/components/ui/button.tsx
import { cn } from '@/lib/utils/cn'
import { theme } from '@/config/theme'

export function Button({ variant = 'primary', className, ...props }) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        {
          'bg-primary-600 text-white hover:bg-primary-700': variant === 'primary',
          'bg-neutral-100 text-neutral-900 hover:bg-neutral-200': variant === 'secondary',
        },
        className
      )}
      {...props}
    />
  )
}
```

---

## ERROR HANDLING ARCHITECTURE

### Error Boundaries

```typescript
// src/components/error-boundary.tsx
'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <AlertTriangle className="w-12 h-12 text-error mb-4" />
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-neutral-500 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

### Error Handling Pattern

```typescript
// src/lib/utils/error.ts
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500
  ) {
    super(message)
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    return new AppError('INTERNAL_ERROR', error.message, 500)
  }

  return new AppError('UNKNOWN_ERROR', 'An unknown error occurred', 500)
}
```

---

## LOADING ARCHITECTURE

### Loading Components

```typescript
// src/components/ui/loading.tsx
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <Loader2
      className={cn('animate-spin', {
        'w-4 h-4': size === 'sm',
        'w-6 h-6': size === 'md',
        'w-8 h-8': size === 'lg',
      }, className)}
    />
  )
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse bg-neutral-200 rounded', className)}
    />
  )
}
```

### Loading Patterns

```typescript
// src/app/(main)/wallet/loading.tsx
import { LoadingSpinner } from '@/components/ui/loading'

export default function WalletLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" />
    </div>
  )
}
```

---

## STATE MANAGEMENT ARCHITECTURE

### Zustand Stores

```typescript
// src/stores/auth-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  telegram_id: string
  username: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)
```

---

## HOOKS STRATEGY

### Custom Hooks

```typescript
// src/hooks/use-auth.ts
import { useAuthStore } from '@/stores/auth-store'
import { useEffect } from 'react'

export function useAuth() {
  const { user, isLoading, isAuthenticated, setUser, setLoading, logout } = useAuthStore()

  useEffect(() => {
    // Check authentication status on mount
    async function checkAuth() {
      try {
        // Check Supabase session
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser({
            id: session.user.id,
            telegram_id: session.user.telegram_id,
            username: session.user.username,
          })
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [setUser, setLoading])

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
  }
}
```

---

## UTILITIES STRATEGY

### Utility Functions

```typescript
// src/lib/utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// src/lib/utils/format.ts
export function formatCurrency(amount: number, currency: 'FC' | 'USD' = 'FC'): string {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return new Intl.NumberFormat('en-US').format(amount) + ' FC'
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const then = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`

  return formatDate(date)
}
```

---

## TYPES STRATEGY

### Type Definitions

```typescript
// src/types/auth.ts
export interface User {
  id: string
  telegram_id: string
  username: string
  first_name: string
  last_name: string
  photo_url: string | null
  created_at: string
  updated_at: string
}

export interface Session {
  access_token: string
  refresh_token: string
  expires_in: number
  user: User
}

// src/types/wallet.ts
export interface Wallet {
  id: string
  user_id: string
  fc_balance: number
  pending_earnings: number
  withdrawable_balance: number
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  currency: 'FC' | 'USD'
  status: TransactionStatus
  reference_id: string | null
  created_at: string
}

export type TransactionType = 'task_completion' | 'ad_watch' | 'app_install' | 'daily_bonus' | 'daily_checkin' | 'referral' | 'settlement' | 'withdrawal'
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled'

// src/types/tasks.ts
export interface Task {
  id: string
  title: string
  description: string
  reward: number
  duration: number
  status: TaskStatus
  created_at: string
  updated_at: string
}

export type TaskStatus = 'active' | 'paused' | 'completed' | 'expired'
```

---

## CONSTANTS STRATEGY

### Application Constants

```typescript
// src/lib/constants/routes.ts
export const ROUTES = {
  HOME: '/home',
  EARN: '/earn',
  PROFILE: '/profile',
  WALLET: '/wallet',
  TASKS: '/tasks',
  REFERRAL: '/referral',
} as const

// src/lib/constants/config.ts
export const CONFIG = {
  AUTH: {
    ACCESS_TOKEN_EXPIRY: 7 * 24 * 60 * 60, // 7 days
    REFRESH_TOKEN_EXPIRY: 30 * 24 * 60 * 60, // 30 days
  },
  WALLET: {
    MINIMUM_WITHDRAWAL: 5000, // FC
    WITHDRAWAL_FEE: 0.02, // 2%
  },
  TASKS: {
    DAILY_LIMIT: 10,
    REWARD_RANGE: { MIN: 25, MAX: 500 },
  },
  CACHE: {
    TTL: 3600, // 1 hour
  },
} as const
```

---

## LOCALIZATION STRATEGY

### i18n Structure

```typescript
// src/locales/en/index.ts
export const translations = {
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
  },
  auth: {
    login: 'Login with Telegram',
    logout: 'Logout',
    welcome: 'Welcome',
  },
  wallet: {
    balance: 'Balance',
    pending: 'Pending',
    withdraw: 'Withdraw',
  },
  tasks: {
    title: 'Tasks',
    complete: 'Complete',
    reward: 'Reward',
  },
}

// src/locales/es/index.ts
export const translations = {
  common: {
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
  },
  auth: {
    login: 'Iniciar sesión con Telegram',
    logout: 'Cerrar sesión',
    welcome: 'Bienvenido',
  },
  wallet: {
    balance: 'Saldo',
    pending: 'Pendiente',
    withdraw: 'Retirar',
  },
  tasks: {
    title: 'Tareas',
    complete: 'Completar',
    reward: 'Recompensa',
  },
}
```

---

## ASSET STRATEGY

### Asset Organization

```
public/
├── images/
│   ├── logo/
│   │   ├── logo-light.png
│   │   └── logo-dark.png
│   ├── icons/
│   │   ├── telegram.png
│   │   └── payeer.png
│   └── placeholders/
│       ├── avatar-default.png
│       └── task-placeholder.png
├── fonts/
│   ├── inter/
│   │   ├── Inter-Regular.woff2
│   │   ├── Inter-Medium.woff2
│   │   └── Inter-Bold.woff2
│   └── ...
└── icons/
    └── lucide/ (if needed)
```

### Asset Usage

```typescript
// Import images
import logoLight from '@/public/images/logo/logo-light.png'

// Use in components
<img src={logoLight.src} alt="Fee Logo" />
```

---

## PERFORMANCE STRATEGY

### Performance Targets

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms
- **Time to Interactive (TTI)**: < 3.5s

### Performance Optimization

**Code Splitting**:
- Automatic via Next.js App Router
- Dynamic imports for heavy components
- Route-based code splitting

**Image Optimization**:
- Use Next.js Image component
- WebP/AVIF formats
- Lazy loading
- Responsive images

**Font Optimization**:
- Use Next.js Font
- Subset fonts
- Preload critical fonts

**Caching**:
- Static assets: CDN cache
- API responses: Redis cache
- Database queries: Query cache

---

## CODE QUALITY RULES

### TypeScript

**Strict Mode**: Enabled
**No Implicit Any**: Enforced
**No Unused Variables**: Enforced
**No Unused Parameters**: Enforced

### React

**Functional Components**: Required
**Hooks Rules**: Enforced (react-hooks/rules-of-hooks)
**PropTypes**: Not needed (TypeScript)
**Default Props**: Use default parameters

### General

**No Console.log**: Use logger (except development)
**No Any**: Use proper types
**No Magic Numbers**: Use constants
**No Hardcoded Strings**: Use translations
**No Deep Nesting**: Max 3 levels

---

## LINT STRATEGY

### ESLint Configuration

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### Lint Commands

```bash
# Run linter
npm run lint

# Fix lint errors
npm run lint:fix
```

---

## FORMATTING STRATEGY

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### Format Commands

```bash
# Format files
npm run format

# Check formatting
npm run format:check
```

---

## GIT WORKFLOW

### Branch Strategy

**Main Branches**:
- `main`: Production code
- `staging`: Staging code
- `develop`: Development code

**Feature Branches**:
- `feature/*`: New features
- `fix/*`: Bug fixes
- `hotfix/*`: Production hotfixes

### Commit Convention

**Format**: `type(scope): description`

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Tests
- `chore`: Maintenance

**Examples**:
```
feat(auth): add Telegram OAuth 2.0
fix(wallet): fix balance calculation
docs(api): update API documentation
```

---

## CI/CD STRATEGY

### GitHub Actions

**CI Pipeline** (`.github/workflows/ci.yml`):
- Lint code
- Type check
- Run tests
- Build application

**CD Staging** (`.github/workflows/cd-staging.yml`):
- Deploy to staging
- Run E2E tests
- Notify team

**CD Production** (`.github/workflows/cd-production.yml`):
- Deploy to production
- Run smoke tests
- Notify team

---

## CONCLUSION

This project foundation establishes the complete engineering foundation for Fee. It defines the folder structure, naming conventions, configuration, and architectural patterns that will be used throughout the project.

**Key Principles Applied**:
- **Scalable**: Enterprise-grade folder structure
- **Maintainable**: Clear naming conventions, well-organized code
- **Type-Safe**: TypeScript strict mode
- **Performant**: Next.js App Router, code splitting
- **Secure**: Supabase, RLS, environment variables

**Next Steps**:
1. Set up project structure
2. Install dependencies
3. Configure Next.js
4. Configure Tailwind CSS
5. Configure Supabase
6. Create base components
7. Implement authentication
8. Implement core features

**This foundation is the starting point for all development work. Every file, every component, every feature must align with this architecture.**

---

*Project Foundation V1*
*Created: 2026-07-18*
*Status: COMPLETE*
*Next Phase: Implementation*