export function formatFC(amount: number): string {
  return new Intl.NumberFormat('en-US').format(amount) + ' FC'
}

/** Plain number (no currency suffix) with grouping — for card balances. */
export function formatFCNum(amount: number): string {
  return new Intl.NumberFormat('en-US').format(amount)
}

/** Approximate USD equivalent of an FC amount (rate 100 FC ≈ $1). */
export function fcToUsd(amount: number): string {
  const usd = amount / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(usd)
}

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